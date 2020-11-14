import connection from '../database/connection';
import * as Yup from 'yup';

class PostController {
  static show = async (req, res) => {
    const { id } = req.params;

    const [ post ] = await connection('post').where('id', id).select('*');

    if(post === undefined) {
      return res.status(204).json({ message: 'Post não encontrado.' });
    }

    // if there is no investment
    if(!(post.investmentId)) {
      return res.status(200).json(PostView.render(post));
    }

    // get investment 
    const [ investment ] = await connection('investment').where('id', post.investmentId)
    .select('*');

    const data = {
      ...post,
      ...investment,
    }

    return res.status(200).json(PostView.render(data));
  }

  static index = async (req, res) => {
    const { userId } = req;

    // get user's friends
    const friends = await connection('friend').where('friendOneId', userId)
      .orWhere('friendTwoId', userId).select('*');

    const friendsPosts = await Promise.all(friends.map(async (friend) => {
      let friendId;
      friend.friendOneId === userId? 
        friendId = friend.friendTwoId : friendId = friend.friendOneId;

      const [ user ] = await connection('user').where('id', friendId)
        .select('id', 'firstName', 'lastName');

      const posts = await connection('post').where('userId', user.id);

      const investments = await Promise.all(posts.map(async (post) => {
        const [ investment ] = await connection('investment').where('postId', post.id)
          .select('serieId');

        const [ serie ] = await connection('serie').where('id', investment.serieId)
          .select('id', 'title', 'description', 'categoryId');
          
        const [ category ] = await connection('category').where('id', serie.categoryId)
          .select('name');

        return {
          serie: {
            id: serie.id,
            title: serie.title,
            description: serie.description,
            category: category.name,
          },
        }
      }));

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        investments,
      };
    }));

    return res.status(200).json(friendsPosts);
  }

  static create = async (req, res) => {
    const { title, description, investmentId } = req.body;
    const { userId } = req;

    // validate
    const schema = Yup.object().shape({
      title: Yup.string().required('Título inválido.'),
      description: Yup.string('Descrição inválida.'),
      investmentId: Yup.number(),
    });

    const values = { title, description, investmentId };

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

    // create post
    const postData = {
      datePost: new Date(),
      title,
      description,
      investmentId,
      userId,
    }

    const trx = await connection.transaction();
    
    const [ id ] = await trx('post').insert(postData);
    
    // add post id into investment
    await trx('investment').update('postId', id).where('id', investmentId);

    await trx.commit();

    const newPost = {
      id,
      ...postData,
    }

    return res.status(201).json(newPost);
  }

  static destroy = async (req, res) => {
    const { id } = req.params;
    const { userId } = req;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer('Post inválido.'),
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

    // get investment
    const [ investment ] = await connection('investment').where('userId', userId)
      .select('id');

    const trx = await connection.transaction();

    await trx('post').where('investmentId', investment.id).del();

    await trx.commit();

    return res.status(200).json({ message: 'Post removido.' });
  }
}

export default PostController;