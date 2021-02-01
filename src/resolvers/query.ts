import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';
const resolversQuery: IResolvers = {
  Query: {
    // users(root, args, context, info) {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'Lista de usuarios cargada correctamente',
          users: await db
            .collection(COLLECTIONS.USERS)
            .find()
            .sort({ registerDate: -1 })
            .toArray()
        };
      } catch (err) {
        return {
          status: false,
          message: 'Error al cargar los usuarios',
          users: []
        };
      }
    },
    async login(_, {email, password}, { db }) {
      try {
        const user = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ email });

        if (user === null) {
          return {
            status: false,
            message: 'Credenciales Inválidas',
            token: null,
          };
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if (passwordCheck) {
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }
        return {
          status: true,
          message:
            !passwordCheck
              ? 'Password y usuario no son correctos, sesión no iniciada'
              : 'Usuario cargado correctamente',
          token: 
            !passwordCheck
              ? null
              : new JWT().sign({ user }, EXPIRETIME.H24),
          
        };
      } catch (err) {
        return {
          status: false,
          message: 'Error al cargar los usuarios',
          token: null
        };
      }
    },
    me(_, __, {token}) {
      let info = new JWT().verify(token)
      if (info === MESSAGES.TOKEN_VERICATION_FAILED) {
        return {
          status: false,
          message: info,
          user: null
        };
      }
      return {
        status: true,
        message: 'Usuario autenticado correctamente',
        user: Object.values(info)[0]
      };
    },
    
  },
};
export default resolversQuery;