using API.data;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Repository
{
    public class ReceitaRepository : IReceitaRepository
    {
        private readonly AppDbContext _context;

        public ReceitaRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Adicionar(Receita receita)
        {
            _context.Receitas.Add(receita);
            _context.SaveChanges();
        }

public void Atualizar(Receita receita)
{
    
    var existente = _context.Receitas.Find(receita.Id);
    if (existente == null)
        throw new Exception("Receita não encontrada");

    // Atualizar os campos manualmente
    existente.Descricao = receita.Descricao;
    existente.Valor = receita.Valor;
    existente.Data = receita.Data;
    existente.CategoriaId = receita.CategoriaId;

    
    _context.SaveChanges();
}


        public void Remover(int id)
        {
            var receita = _context.Receitas.Find(id);
            if (receita != null)
            {
                _context.Receitas.Remove(receita);
                _context.SaveChanges();
            }
        }

        public Receita? BuscarPorId(int id)
        {
            return _context.Receitas.Find(id);
        }

        public IEnumerable<Receita> ListarTodas()
        {
            return _context.Receitas.ToList();
        }
    }
}
