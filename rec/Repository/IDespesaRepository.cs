using API.Models;
using System.Collections.Generic;

namespace API.Repository
{
    public interface IDespesaRepository
    {
        void Adicionar(Despesa despesa);
        void Atualizar(Despesa despesa);
        void Remover(int id);
        Despesa? BuscarPorId(int id);
        IEnumerable<Despesa> ListarTodas();
    }
}
