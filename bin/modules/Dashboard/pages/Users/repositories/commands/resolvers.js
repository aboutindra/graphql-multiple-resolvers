import { encryptPassword, authenticate, generateToken } from '../../utils';
// eslint-disable-next-line
import { Post } from '../../models';

const userResolvers = {
  User: {
    posts: async ({ id }) => Post.findAll({ where: { UserId: id } }),
  },
  Query: {
    users: async (root, args, { models: { User } }) => User.findAll(),
    user: async (root, { search }, { models: { User } }) => User.find().forEach(function(doc){
      for (var key in doc) {
        if ( new RegExp(search).test(doc[key]) )
          return doc;
      }
    }),
  },
  Mutation: {
    updateUser: async (root, { id, name }, { models: { User } }) => User.update({
      name,
    }, {
      returning: true,
      where: {
        id,
      },
    }).then(([rowsUpdate, [updated]]) => (rowsUpdate ? updated.dataValues : {})),
    deleteUser: async (root, { id }, { models: { User }, authScope }) => {
      if (authScope.user === null || id !== authScope.user.id) {
        throw new Error('You cannot delete this user account!');
      }
      User.destroy({
        where: {
          id,
        },
      });
    },
  },

};

export default userResolvers;
