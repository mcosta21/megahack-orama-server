import connection from '../database/connection';
import * as Yup from 'yup';

import PostView from '../views/PostView.js';

class PostController {
  static show = async (req, res) => {
    const { id } = req.params;

    const [ post ] = await connection('post').where('id', id).select('*');

    if(post === undefined) {
      return res.status(400).json({ error: 'Post not found' });
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

      const series = await Promise.all(posts.map(async (post) => {
        const [ investment ] = await connection('investment').where('postId', post.id)
          .select('serieId');

        const [ serie ] = await connection('serie').where('id', investment.serieId)
          .select('title', 'description', 'categoryId');
          
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
        series,
      };
    }));

    return res.status(200).json(friendsPosts);
  }

  static create = async (req, res) => {
    const { title, description, investmentId } = req.body;
    const { userId } = req;

    // validate
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      investmentId: Yup.number(),
    });

    if(!(await schema.isValid({ title, description, investmentId }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // create post
    const postData = {
      datePost: new Date(),
      title,
      description,
      investmentId,
      userId,
    }
    
    const [ id ] = await connection('post').insert(postData);
    
    // add post id into investment
    await connection('investment').update('postId', id).where('id', investmentId);

    return res.status(201).json(postData);
  }

  static destroy = async (req, res) => {
    const { id } = req.params;
    const { userId } = req;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // get investment
    const [ investment ] = await connection('investment').where('userId', userId)
      .select('id');

    await connection('post').where('investmentId', investment.id).del();

    return res.status(200).json({ success: true });
  }
}

export default PostController;