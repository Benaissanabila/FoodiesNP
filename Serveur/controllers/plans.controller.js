import * as queries from '../database/queries/plans.queries.js';

export const createPlan = async (req, res) => {
  try {
    const plan = await queries.createPlanQuery(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await queries.getPlansQuery();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlan = async (req, res) => {
  try {
    const plan = await queries.getPlanQuery(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await queries.updatePlanQuery(req.params.id, req.body);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await queries.deletePlanQuery(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  


