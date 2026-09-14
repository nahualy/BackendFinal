import {
  createProvider as createProviderService,
  deleteProvider as deleteProviderService,
  getAllProviders,
  getProviderById,
  updateProvider as updateProviderService,
} from '../services/providers.service.js';

const handleError = (res, error) => {
  console.error('Error en providers.controller:', error);
  return res.status(500).json({ message: 'Error interno del servidor' });
};

export const getProviders = async (_req, res) => {
  try {
    return res.json({ providers: await getAllProviders() });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProvider = async (req, res) => {
  try {
    const provider = await getProviderById(req.params.id);
    return provider ? res.json({ provider })
      : res.status(404).json({ message: 'Proveedor no encontrado' });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createProvider = async (_req, res) => {
  try {
    return res.status(201).json({
      message: 'Proveedor creado correctamente',
      provider: await createProviderService(),
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateProvider = async (req, res) => {
  try {
    const provider = await updateProviderService(req.params.id, req.body || {});
    return provider ? res.json({ message: 'Proveedor actualizado correctamente', provider })
      : res.status(404).json({ message: 'Proveedor no encontrado' });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const provider = await deleteProviderService(req.params.id);
    return provider ? res.json({ message: 'Proveedor eliminado correctamente', provider })
      : res.status(404).json({ message: 'Proveedor no encontrado' });
  } catch (error) {
    return handleError(res, error);
  }
};