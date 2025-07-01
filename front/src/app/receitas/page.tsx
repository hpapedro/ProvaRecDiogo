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

interface Receita {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const listarReceitas = async () => {
    try {
      const res = await fetch("http://localhost:5183/api/receitas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar");

      const data = await res.json();
      console.log("Receitas:", data);

      const receitasArray = data.$values ?? [];
      setReceitas(receitasArray);
      setErro("");
    } catch (err) {
      console.error(err);
      setErro("Erro ao listar receitas");
      setReceitas([]);
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

  const salvarReceita = async () => {
    setErro("");

    if (!descricao || valor === "" || !data) {
      setErro("Preencha todos os campos");
      return;
    }

    const payload = {
      descricao,
      valor: Number(valor),
      data,
      categoriaId: 1,
    };

    try {
      const res = await fetch(
        `http://localhost:5183/api/receitas/${editandoId ?? ""}`,
        {
          method: editandoId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            editandoId ? { ...payload, id: editandoId } : payload
          ),
        }
      );

      if (!res.ok) throw new Error("Erro ao salvar receita");

      limparFormulario();
      listarReceitas();
    } catch (err) {
      setErro("Erro ao salvar receita");
    }
  };

  const editarReceita = (receita: Receita) => {
    setDescricao(receita.descricao);
    setValor(receita.valor);
    setData(receita.data.split("T")[0]);
    setEditandoId(receita.id);
  };

  const deletarReceita = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5183/api/receitas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      listarReceitas();
    } catch (err) {
      console.error("Erro ao excluir", err);
      setErro("Erro ao excluir receita");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gerenciar Receitas
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
            <Button variant="contained" onClick={salvarReceita}>
              {editandoId ? "Atualizar" : "Cadastrar"}
            </Button>

            <Button variant="outlined" onClick={listarReceitas}>
              Listar Receitas
            </Button>

            <Button variant="text" color="inherit" onClick={limparFormulario}>
              Limpar
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {receitas.length > 0 && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lista de Receitas
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
              {receitas.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.descricao}</TableCell>
                  <TableCell>R$ {r.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(r.data).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => editarReceita(r)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deletarReceita(r.id)}
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
