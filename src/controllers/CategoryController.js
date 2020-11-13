import connection from '../database/connection';
import * as Yup from 'yup';
import CategoryView from '../views/CategoryView';

class CategoryController {
  static show = async (req, res) => {
    const { id } = req.params;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(400).json({ error: 'Category id is not valid' });
    }

    // search
    const [ category ] = await connection('category').where('id', id).select('*');

		if(category === undefined) {
			return res.status(400).json({ error: 'Category does not exist' });
    }

    return res.status(200).json(CategoryView.render(category.id, category.name));
  }

  static index = async (req, res) => {
    const categories = await connection('category').select('*');

    return res.status(200).json(CategoryView.renderMany(categories));
  }

  static create = async (req, res) => {
    const { name } = req.body;

    // // validate
    // const schema = Yup.object().shape({
    //   name: Yup.string().required(),
    // });

    // if(!(await schema.isValid({ name }))) {
    //   return res.status(400).json({ error: 'Category name not valid' });
    // }

    // // check if category exists
		// const [ category ] = await connection('category').where('name', name).select('id');

		// if(category !== undefined) {
		// 	return res.status(400).json({ error: 'Category already exists' });
    // }
    
    // // create category
    // const [ id ] = await connection('category').insert({ name });

    // return res.status(201).json(CategoryView.render(id, name));
  }

  static update = async (req, res) => {
    const { id, newName } = req.body;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
      newName: Yup.string().required(),
    });

    if(!(await schema.isValid({ id, newName }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // get category
    const [ category ] = await connection('category').where('id', id).select('*');

    if(category === undefined) {
      return res.status(204).json({ result: 'Category not found' });
    }

    // update category name
    await connection('category').update({ name: newName }).where('id', id);

    return res.status(200).json(CategoryView.render(id, newName));
  }

  static destroy = async (req, res) => {
    const { id } = req.params;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    await connection('category').where('id', id).del();

    return res.status(202).json({ success: true });
  }
}

export default CategoryController;