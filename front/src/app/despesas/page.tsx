"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Stack,
  Alert,
  Paper,
} from "@mui/material";

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  
const listarDespesas = async () => {
  try {
    const res = await fetch("http://localhost:5183/api/despesas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Erro ao buscar");

    const data = await res.json();
    console.log("Despesas:", data);

    const despesasArray = data.$values ?? []; // <-- Aqui tá o pulo do gato
    setDespesas(despesasArray);
    setErro("");
  } catch (err) {
    console.error(err);
    setErro("Erro ao listar despesas");
    setDespesas([]);
  }
};


  useEffect(() => {
  }, []);

  const limparFormulario = () => {
    setDescricao("");
    setValor("");
    setData("");
    setEditandoId(null);
    setErro("");
  };

  const salvarDespesa = async () => {
    setErro("");

    if (!descricao || valor === "" || !data) {
      setErro("Preencha todos os campos");
      return;
    }

    const payload = {
      descricao,
      valor: Number(valor),
      data,
    };

    try {
      const res = await fetch(`http://localhost:5183/api/despesas/${editandoId ?? ""}`, {
        method: editandoId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editandoId ? { ...payload, id: editandoId } : payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar despesa");

      limparFormulario();
      listarDespesas();
    } catch (err) {
      setErro("Erro ao salvar despesa");
    }
  };

  const editarDespesa = (despesa: Despesa) => {
    setDescricao(despesa.descricao);
    setValor(despesa.valor);
    setData(despesa.data.split("T")[0]);
    setEditandoId(despesa.id);
  };

  const deletarDespesa = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5183/api/despesas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      listarDespesas();
    } catch (err) {
      console.error("Erro ao excluir", err);
      setErro("Erro ao excluir despesa");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gerenciar Despesas
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
          />
          <TextField
            label="Valor"
            type="number"
            value={valor}
            onChange={(e) =>
              setValor(e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            fullWidth
          />
          <TextField
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {erro && <Alert severity="error">{erro}</Alert>}

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={salvarDespesa}>
              {editandoId ? "Atualizar" : "Cadastrar"}
            </Button>

            
            <Button variant="outlined" onClick={listarDespesas}>
              Listar Despesas
            </Button>

            
            <Button variant="text" color="inherit" onClick={limparFormulario}>
              Limpar
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {despesas.length > 0 && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lista de Despesas
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {despesas.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.descricao}</TableCell>
                  <TableCell>R$ {d.valor.toFixed(2)}</TableCell>
                  <TableCell>{new Date(d.data).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button variant="outlined" size="small" onClick={() => editarDespesa(d)}>
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deletarDespesa(d.id)}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
