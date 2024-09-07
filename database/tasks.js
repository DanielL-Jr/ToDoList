const supabase = require("./connection");

const lerTarefas = async (user_id) => {
  let consulta = await supabase
    .from("tasks")
    .select("id, feita, descricao, inicio, fim")
    .eq("user_id", user_id);
  if (consulta.error) {
    console.error("Erro ao consultar tarefas: ", consulta.error);
  } else {
    console.log("Consulta bem sucedida!");
  }
  return consulta;
};

const trocarEstado = async (estado, id) => {
  let { data } = await supabase.from("tasks").select("id").eq("id", id);
  if (data.length == 0) return { error: "Tarefa não encontrada" };
  let consulta = await supabase
    .from("tasks")
    .update({ feita: estado })
    .eq("id", id);
  if (consulta.error) {
    console.error("Erro ao atualizar a tarefa: ", consulta.error);
  } else {
    console.log("Tarefa atualizada com sucesso!");
  }
  return consulta;
};

const atualizarTarefa = async (tarefa) => {
  let consulta = await supabase
    .from("tasks")
    .update({
      inicio: tarefa.inicio,
      fim: tarefa.fim,
      descricao: tarefa.descricao,
      feita: tarefa.status,
    })
    .eq("id", tarefa.id)
    .select();
  if (consulta.error) {
    console.error("Erro ao atualizar tarefa: ", consulta.error);
  } else if (consulta.data) {
    console.log("Tarefa Atualizada com Sucesso!");
  } else {
    consulta.error = "A tarefa não existe.";
  }
  return consulta
};

const deletarTarefa = async (id) => {
  let consulta = await supabase.from("tasks").delete().eq("id", id);
  if (consulta.error) {
    console.error("Erro ao deletar tarefa: ", consulta.error);
  } else if (consulta.data) {
    console.log("Tarefa deletada com sucesso!");
  } else {
    console.log("Tarefa Não Existe");
    consulta.error = "Tarefa Não Existe";
  }
  return consulta;
};

module.exports = { lerTarefas, trocarEstado, atualizarTarefa, deletarTarefa };
