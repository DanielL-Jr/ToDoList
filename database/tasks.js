const supabase = require("./connection");

const lerTarefas = async (user_id) => {
  let consulta = await supabase
    .from("tasks")
    .select("id, feita, descricao, inicio, fim")
    .eq("user_id", user_id);
  if (consulta.error) {
    console.log("Erro ao consultar tarefas: ", consulta.error);
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
    console.log("Erro ao atualizar a tarefa: ", consulta.error);
  } else {
    console.log("Tarefa atualizada com sucesso!");
  }
  return consulta;
};

module.exports = { lerTarefas, trocarEstado };
