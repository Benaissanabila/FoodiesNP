import Plan from '../models/plan.model.js';

// Créer un plan
export const createPlanQuery = async (plan) => {
  return Plan.create(plan);
};

// Récupérer tous les plans
export const getPlansQuery = async () => {
  return Plan.find({});
};

// Récupérer un plan par ID
export const getPlanQuery = async (id) => {
  return Plan.findById(id);
};

export const deletePlanQuery = async (id) => {
  return Plan.findByIdAndDelete(id);
}

export const  updatePlanQuery = async (id, plan) => {
    return Plan.findByIdAndUpdate(id, plan)
}