import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/user.service";
import { validateUser, validateUserPartial } from "../schemas/user.schema";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de usuario inválido",
      });
    }

    const user = await UserService.findById(id);

    if (!user) {
      return res.status(404).json({
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { success, error, data } = validateUser(req.body);

    if (!success) {
      return res.status(400).json(error.issues);
    }

    // Verificar si el email ya existe
    const existingUser = await UserService.findByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({
        message: "El email ya está registrado",
      });
    }

    const newUser = await UserService.create(data);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de usuario inválido",
      });
    }

    const { success, error, data } = validateUserPartial(req.body);

    if (!success) {
      return res.status(400).json(error.issues);
    }

    const result = await UserService.findById(id);

    if (!result) {
      return res.status(404).json({
        message: "El usuario no existe",
      });
    }

    // Si se está actualizando el email, verificar que no exista
    if (data.email && data.email !== result.email) {
      const existingUser = await UserService.findByEmail(data.email);
      if (existingUser) {
        return res.status(409).json({
          message: "El email ya está registrado",
        });
      }
    }

    const user = await UserService.update(id, data);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de usuario inválido",
      });
    }

    const user = await UserService.findById(id);

    if (!user) {
      return res.status(404).json({
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    await UserService.remove(id);

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
};
