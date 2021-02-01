import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import bcrypt from 'bcrypt';
const resolversMutation: IResolvers = {
  Mutation: {
    // register(root, args, context, info) {
    async register(root, { user }, { db }) {
      // Comprobar que el usuario no existe
      const userCheck = await db
      .collection(COLLECTIONS.USERS)
      .findOne({email: user.email})
  
      if (userCheck) {
        return {
          status: true,
          message: `El usuario con el email ${user.email} ya se enncuentra registrado, elija otro`,
          user: null
        };
      } 
        // Comprobar el último usuario registrado para asignar ID
      const lastUser = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();
      if (lastUser.length === 0) {
        user.id = 1; 
      } else {
        user.id = lastUser[0].id + 1;
      }
      // Asignar la fecha en formato ISO en la prop registerDate
      user.registerDate = new Date().toISOString();
      // Encriptar password
      user.password = bcrypt.hashSync(user.password, 10);
      // Guardar el documento registro
      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(user)
        .then(async () => {
          return {
            status: true,
            message: `El usuario con el email ${user.email} está registrado correctamente`,
            user
          };
        })
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: `Error inesperado, prueba de nuevo`,
            user: null
          };
        });
    }
  }
};
export default resolversMutation;