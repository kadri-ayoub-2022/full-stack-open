import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

export const getAllPersons = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const addPerson = async (person) => {
  const response = await axios.post(baseUrl, person);
  return response.data;
};

export const deletePerson = async (id) => {
  await axios.delete(`${baseUrl}/${id}`);
};

export const updatePerson = async (id, updatedPerson) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedPerson);
  return response.data;
};