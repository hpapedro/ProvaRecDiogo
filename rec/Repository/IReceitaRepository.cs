using API.Models;
using System.Collections.Generic;

namespace API.Repository
{
    public interface IReceitaRepository
    {
        void Adicionar(Receita receita);
        void Atualizar(Receita receita);
        void Remover(int id);
        Receita? BuscarPorId(int id);
        IEnumerable<Receita> ListarTodas();
    }
}
