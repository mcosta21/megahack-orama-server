import connection from '../database/connection';
import * as Yup from 'yup';
import CategoryView from '../views/CategoryView';

class CategoryController {
  static show = async (req, res) => {
    const { id } = req.params;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required()
      .integer('É preciso enviar um número inteiro.'),
    });

    if(!(await schema.isValid({ id }))) {
      const validation = await schema.validate({ id }, { abortEarly: false })
      .catch(err => {
        const errors = err.errors.map(message => {
          return { "message": message } 
        });
        return errors;
      }); 

      return res.status(203).json(validation);
    }

    // search
    const [ category ] = await connection('category').where('id', id).select('*');

		if(category === undefined) {
			return res.status(203).json({ message: 'Categoria não encontrada.' });
    }

    return res.status(200).json(CategoryView.render(category.id, category.name));
  }

  static index = async (req, res) => {
    const categories = await connection('category').select('*');

    return res.status(200).json(CategoryView.renderMany(categories));
  }

  static create = async (req, res) => {
    const { name } = req.body;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome inválido.'),
      id: Yup.number().required().integer('Usuário inválido.'),
    });

    const values = { name, id };

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

    // check if category exists
		const [ category ] = await connection('category').where('name', name).select('id');

		if(category !== undefined) {
			return res.status(203).json({ error: 'Categoria já existe.' });
    }

    const trx = await connection.transaction();
    
    // create category
    const [ categoryId ] = await trx('category').insert({ name });

    await trx.commit();

    return res.status(201).json(CategoryView.render(categoryId, name));
  }

  static update = async (req, res) => {
    const { categoryId, newName } = req.body;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      categoryId: Yup.number().required().integer('Categoria invalida.'),
      newName: Yup.string().required('O novo nome da categoria deve ser um texto.'),
      id: Yup.number().required().integer('Usuário inválido.'),
    });

    const values = { categoryId, newName, id };

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

    // get category
    const [ category ] = await connection('category').where('id', categoryId).select('*');

    if(category === undefined) {
      return res.status(203).json({ message: 'Categoria não encontrada.' });
    }

    const trx = await connection.transaction();

    // update category name
    await trx('category').update({ name: newName }).where('id', id);

    await trx.commit();

    return res.status(200).json(CategoryView.render(id, newName));
  }

  static destroy = async (req, res) => {
    const { categoryId } = req.params;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      categoryId: Yup.number().required().integer('Categoria inválida.'),
      id: Yup.number().required().integer('Usuário inválido.'),
    });

    const values = { categoryId, id };

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

    await trx('category').where('id', categoryId).del();

    await trx.commit();

    return res.status(200).json({ message: 'Categoria removida.' });
  }
}

export default CategoryController;