import connection from '../database/connection';
import * as Yup from 'yup';

import SerieView from '../views/SerieView';

class SerieController {
  static show = async (req, res) => {
    const { id } = req.params;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer('Série inválida.'),
    });

    const values = { id };

    if(!(await schema.isValid(values))) {
      const validation = await schema.validate(values, { abortEarly: false })
      .catch(err => {
        const errors = err.errors.map(message => {
          return { "message": message } 
        });

        return errors;
      }); 

      return res.status(203).json(validation);
    }

    // get serie
    const [ serie ] = await connection('serie').where('id', id).select('*');
    
    if(serie === undefined) {
      return res.status(203).json({ message: 'Série não encontrada.' });
    }

    return res.status(200).json(await SerieView.render(serie));
  }

  static showByCategory = async (req, res) => {
    const { id } = req.params;

    const series = await connection('serie').where('categoryId', id).select('*');

    return res.status(200).json(await Promise.all(SerieView.renderMany(series)));
  }

  static index = async (req, res) => {
    const series = await connection('serie').select('*');
    return res.status(200).json(await Promise.all(SerieView.renderMany(series)));
  }

  static create = async (req, res) => {
    const { 
      cost,
      yieldValue,
      duration,
      title,
      description,
      categoryId,
    } = req.body;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      cost: Yup.number().required('Custo inválido.'),
      yieldValue: Yup.number().required('Valor de rendimento inválido.'),
      duration: Yup.number().required('Duração inválida.'),
      title: Yup.string().required('Título inválido.'),
      description: Yup.string().required('Descrição inválida.'),
      categoryId: Yup.number().required().integer('Categoria inválida.'),
      id: Yup.number().required().integer('Usuário inválido.'),
    });

    const values = { 
      cost,
      yieldValue,
      duration,
      title,
      description,
      categoryId,
      id,
    };

    if(!(await schema.isValid(values))) {
      const validation = await schema.validate(values, { abortEarly: false })
      .catch(err => {
        const errors = err.errors.map(message => {
          return { "message": message } 
        });

        return errors;
      }); 

      return res.status(203).json(validation);
    }

    // check if user is an admin
    const [ user ] = await connection('user').where('id', id).select('admin');

    if(user.admin === 0) {
      return res.status(203).json({ message: 'Usuário não é um administrador.' });
    }

    // check if serie exists
    const [ serie ] = await connection('serie').where('title', title).select('*');

    if(serie !== undefined) {
      return res.status(203).json({ message: 'Série já existe.'});
    }

    // check if category exists
    const [ category ] = await connection('category').where('id', categoryId).select('id');
    
    if(category === undefined) {
      return res.status(203).json({ message: 'Categoria não encontrada.' });
    }

    const newSerie = {
			cost,
      yield: yieldValue,
      duration,
      title,
      description,
      categoryId,
    };
    
    const trx = await connection.transaction();

    const serieId = await trx('serie').insert(newSerie);

    await trx.commit();
    
    const createdSerie = {
      serieId,
      ...newSerie,
    }

    return res.status(200).json(await SerieView.render(createdSerie));
  }

  static update = async (req, res) => {
    const { 
      serieId, 
      newCost,
      newYield,
      newDuration,
      newTitle,
      newDescription,
      newCategoryId,
    } = req.body;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      serieId: Yup.number().required().integer('Série inválida.'),
      newCost: Yup.number(),
      newYield: Yup.number(),
      newDuration: Yup.number(),
      newTitle: Yup.string('Título inválido.'),
      newDescription: Yup.string(),
      newCategoryId: Yup.number().integer('Categoria inválida.'),
      id: Yup.number().required().integer('Usuário inválido.'),
    });

    const values = { 
      serieId,
      newCost,
      newYield,
      newDuration,
      newTitle,
      newDescription,
      newCategoryId,
      id,
    };

    if(!(await schema.isValid(values))) {
      const validation = await schema.validate(values, { abortEarly: false })
      .catch(err => {
        const errors = err.errors.map(message => {
          return { "message": message } 
        });

        return errors;
      }); 

      return res.status(203).json(validation);
    }

    // check if user is an admin
    const [ user ] = await connection('user').where('id', id).select('admin');

    if(user.admin === 0) {
      return res.status(203).json({ message: 'Usuário não é um administrador.' });
    }

    // get serie
    const [ serie ] = await connection('serie').where('id', serieId).select('*');
    
    if(serie === undefined) {
      return res.status(203).json({ message: 'Série não encontrada.' });
    }

    const trx = await connection.transaction();

    // check what is meant to be updated and update it
    if(newCost) {
      await trx('serie').update({ cost: newCost }).where('id', serieId);
    }
    if(newYield) {
      await trx('serie').update({ yield: newYield }).where('id', serieId);
    }
    if(newDuration) {
      await trx('serie').update({ duration: newDuration }).where('id', serieId);
    }
    if(newTitle) {
      await trx('serie').update({ title: newTitle }).where('id', serieId);
    }
    if(newDescription) {
      await trx('serie').update({ description: newDescription }).where('id', serieId);
    }
    if(newCategoryId) {
      // check if id is valid
      const [ category ] = await trx('category').where('id', newCategoryId)
      .select('id');

      if(category === undefined) {
        return res.status(203).json({ message: 'Categoria não encontrada.' });
      }
      
      await trx('serie').update({ categoryId: newCategoryId }).where('id', serieId);
    }

    await trx.commit();

    // get updated serie
    const [ updatedSerie ] = await connection('serie').where('id', serieId).select('*');

    return res.status(200).json(await SerieView.render(updatedSerie));
  }

  static destroy = async (req, res) => {
    const { serieId } = req.params;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      serieId: Yup.number().required().integer('Série inválida.'),
      id: Yup.number().required().integer('Usuário inválido.'),
    });

    const values = { serieId, id };

    if(!(await schema.isValid(values))) {
      const validation = await schema.validate(values, { abortEarly: false })
      .catch(err => {
        const errors = err.errors.map(message => {
          return { "message": message } 
        });

        return errors;
      }); 

      return res.status(203).json(validation);
    }

    // check if user is an admin
    const [ user ] = await connection('user').where('id', id).select('admin');

    if(user.admin === 0) {
      return res.status(203).json({ message: 'Usuário não é um administrador.' });
    }

    const trx = await connection.transaction();

    await trx('serie').where('id', serieId).del();

    await trx.commit();

    return res.status(202).json({ message: 'Série removida.' });
  }
}

export default SerieController;