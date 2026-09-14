import { Provider } from '../models/index.js';

export const getAllProviders = () => Provider.findAll({ order: [['id', 'ASC']] });

export const getProviderById = (id) => Provider.findByPk(id);

export const createProvider = () => Provider.create({});

export const updateProvider = async (id) => {
  const provider = await Provider.findByPk(id);
  if (!provider) return null;

  await provider.save();
  return provider;
};

export const deleteProvider = async (id) => {
  const provider = await Provider.findByPk(id);
  if (!provider) return null;

  await provider.destroy();
  return provider;
};