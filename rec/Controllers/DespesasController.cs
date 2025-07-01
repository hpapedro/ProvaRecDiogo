using API.Models;
using API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]  
    public class DespesasController : ControllerBase
    {
        private readonly IDespesaRepository _repository;

        public DespesasController(IDespesaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var despesas = _repository.ListarTodas();
            return Ok(despesas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var despesa = _repository.BuscarPorId(id);
            if (despesa == null) return NotFound();
            return Ok(despesa);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Despesa despesa)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _repository.Adicionar(despesa);
            return CreatedAtAction(nameof(GetById), new { id = despesa.Id }, despesa);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Despesa despesa)
        {
            if (id != despesa.Id)
                return BadRequest("Id do registro não confere");

            var existente = _repository.BuscarPorId(id);
            if (existente == null)
                return NotFound();

            _repository.Atualizar(despesa);
            return Ok("Despesa atualizada com sucesso");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var despesa = _repository.BuscarPorId(id);
            if (despesa == null)
                return NotFound();

            _repository.Remover(id);
            return Ok("Despesa removida com sucesso");
        }
    }
}
