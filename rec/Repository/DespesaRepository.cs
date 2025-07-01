using API.data;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Repository
{
    public class DespesaRepository : IDespesaRepository
    {
        private readonly AppDbContext _context;

        public DespesaRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Adicionar(Despesa despesa)
        {
            _context.Despesas.Add(despesa);
            _context.SaveChanges();
        }

public void Atualizar(Despesa despesa)
{
    var existente = _context.Despesas.Find(despesa.Id);
    if (existente == null)
        throw new Exception("Despesa não encontrada");

    existente.Descricao = despesa.Descricao;
    existente.Valor = despesa.Valor;
    existente.Data = despesa.Data;
    existente.CategoriaId = despesa.CategoriaId;

    _context.SaveChanges();
}


        public void Remover(int id)
        {
            var despesa = _context.Despesas.Find(id);
            if (despesa != null)
            {
                _context.Despesas.Remove(despesa);
                _context.SaveChanges();
            }
        }

        public Despesa? BuscarPorId(int id)
        {
            return _context.Despesas.Find(id);
        }

        public IEnumerable<Despesa> ListarTodas()
        {
            return _context.Despesas.ToList();
        }
    }
}
