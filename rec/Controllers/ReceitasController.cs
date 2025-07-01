using API.Models;
using API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]  
    public class ReceitasController : ControllerBase
    {
        private readonly IReceitaRepository _repository;

        public ReceitasController(IReceitaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var receitas = _repository.ListarTodas();
            return Ok(receitas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var receita = _repository.BuscarPorId(id);
            if (receita == null) return NotFound();
            return Ok(receita);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Receita receita)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _repository.Adicionar(receita);
            return CreatedAtAction(nameof(GetById), new { id = receita.Id }, receita);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Receita receita)
        {
            if (id != receita.Id)
                return BadRequest("Id do registro não confere");

            var existente = _repository.BuscarPorId(id);
            if (existente == null)
                return NotFound();

            _repository.Atualizar(receita);
            return Ok("Receita atualizada com sucesso");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var receita = _repository.BuscarPorId(id);
            if (receita == null)
                return NotFound();

            _repository.Remover(id);
            return Ok("Receita removida com sucesso");
        }
    }
}

