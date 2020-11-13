import connection from '../database/connection';
import * as Yup from 'yup';

import SerieView from '../views/SerieView';

class SerieController {
  static show = async (req, res) => {
    const { id } = req.params;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // get serie
    const [ serie ] = await connection('serie').where('id', id).select('*');
    
    if(serie === undefined) {
      return res.status(400).json({ error: 'Serie not found' });
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
      cost: Yup.number().required(),
      yieldValue: Yup.number().required(),
      duration: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      categoryId: Yup.number().required().integer(),
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ 
      cost,
      yieldValue,
      duration,
      title,
      description,
      categoryId,
      id,
    }))) {
    return res.status(400).json({ error: 'Validation failed' });  
    }

    // check if user is an admin
    const [ user ] = await connection('user').where('id', id).select('admin');

    if(user.admin === 0) {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    // check if serie exists
    const [ serie ] = await connection('serie').where('title', title).select('*');

    if(serie !== undefined) {
      return res.status(400).json({ error: 'Serie already exists '});
    }

    // check if category exists
    const [ category ] = await connection('category').where('id', categoryId).select('id');
    
    if(category === undefined) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const newSerie = {
			cost,
      yield: yieldValue,
      duration,
      title,
      description,
      categoryId,
		};

    const serieId = await connection('serie').insert(newSerie);
    
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
      serieId: Yup.number().required().integer(),
      newCost: Yup.number(),
      newYield: Yup.number(),
      newDuration: Yup.number(),
      newTitle: Yup.string(),
      newDescription: Yup.string(),
      newCategoryId: Yup.number().integer(),
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ 
      serieId, 
      newCost,
      newYield,
      newDuration,
      newTitle,
      newDescription,
      newCategoryId,
      id,
    }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // check if user is an admin
    const [ user ] = await connection('user').where('id', id).select('admin');

    if(user.admin === 0) {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    // get serie
    const [ serie ] = await connection('serie').where('id', serieId).select('*');
    
    if(serie === undefined) {
      return res.status(400).json({ result: 'Serie not found' });
    }

    // check what is meant to be updated and update it
    if(newCost) {
      await connection('serie').update({ cost: newCost }).where('id', serieId);
    }
    if(newYield) {
      await connection('serie').update({ yield: newYield }).where('id', serieId);
    }
    if(newDuration) {
      await connection('serie').update({ duration: newDuration }).where('id', serieId);
    }
    if(newTitle) {
      await connection('serie').update({ title: newTitle }).where('id', serieId);
    }
    if(newDescription) {
      await connection('serie').update({ description: newDescription }).where('id', serieId);
    }
    if(newCategoryId) {
      // check if id is valid
      const [ category ] = await connection('category').where('id', newCategoryId)
      .select('id');

      if(category === undefined) {
        return res.status(400).json({ error: 'Category not found' });
      }
      
      await connection('serie').update({ categoryId: newCategoryId }).where('id', serieId);
    }

    // get updated serie
    const [ updatedSerie ] = await connection('serie').where('id', serieId).select('*');

    return res.status(200).json(await SerieView.render(updatedSerie));
  }

  static destroy = async (req, res) => {
    const { serieId } = req.params;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      serieId: Yup.number().required().integer(),
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ serieId, id }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // check if user is an admin
    const [ user ] = await connection('user').where('id', id).select('admin');

    if(user.admin === 0) {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    await connection('serie').where('id', serieId).del();

    return res.status(202).json({ success: true });
  }
}

export default SerieController;