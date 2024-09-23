import * as queries from "../database/queries/restaurants.queries.js";

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.createRestaurantQuery(req.body);
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.getRestaurantQuery(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status500().json({ error: error.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await queries.getAllRestaurantsQuery();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};