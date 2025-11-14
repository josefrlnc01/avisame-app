
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { pool } from '../config/db.js';
export const createUser = async (req, res) => {
    const { userData } = req.body;
     
      if (!userData || !userData.email) {
        return res.status(400).json({
          success: false,
          message: 'Datos de usuario incompletos'
        });
      }
      
      try {
        let user;
        
        // Buscar usuario existente
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [userData.email])
        console.log('Usuario existente:', existingUser);
        
        if (existingUser) {
          user = existingUser;
          console.log('🔑 Usuario existente encontrado:', { id: user.id, email: user.email });
        } else {
          // Crear nuevo usuario
          console.log('🆕 Creando nuevo usuario para:', userData.email);
          const newUser = await pool.query(`
            INSERT INTO users (email, name)
            VALUES ($1, $2)
          `, [userData.email, userData.name] || userData.email.split('@')[0])
          
          user = await pool.query('SELECT * FROM users WHERE id = ?', [newUser.lastInsertRowid])
          console.log('✅ Nuevo usuario creado:', { id: user.id, email: user.email });
        }
        
        // Generate tokens
        const refreshToken = jwt.sign(
          { 
            id: user.id, 
            email: user.email 
          }, 
          process.env.VITE_REFRESH_TOKEN,
          { expiresIn: '24h' }
        );
    
        // Store refresh token in the database
        await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2',[refreshToken, user.id])
        // Generate access token
        const accessToken = jwt.sign(
          { 
            id: user.id, 
            email: user.email 
          }, 
          process.env.VITE_ACCESS_TOKEN,
          { expiresIn: '1h' }
        );
    
         // 👇 PRUEBA: Verifica el token inmediatamente después de crearlo
        try {
          const testDecode = jwt.verify(accessToken, process.env.VITE_ACCESS_TOKEN);
          console.log('✅ TEST: Token verificado correctamente:', testDecode);
        } catch (testError) {
          console.error('❌ TEST: Error al verificar token recién creado:', testError.message);
        }
        
        console.log('🔑 Token generado para el usuario:', { 
          userId: user.id, 
          accessToken,
          refreshToken
        });
        
        res
        .cookie('accessToken', accessToken, {
          httpOnly : true,
          secure : false, 
          sameSite : 'lax',
          maxAge: 60 * 60 * 1000, //1 hora
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge:  24 * 60 * 60 * 1000, //24 horas
        })
        .send({
          success: true,
          message: 'Inicio de sesión exitoso',
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          },
          tokens : {
            accessToken,
            refreshToken
          }
        
        });
        
      } catch (error) {
        console.error('❌ Error en /api/user:', error);
        res.status(500).json({
          success: false,
          error: 'Error en el servidor',
          details: error.message
        });
      }
}


export const getUser = async (req, res) => {
    try{
        const userId = req.user.id;
      const user = await pool.query(`
        SELECT email, name
        FROM users
        WHERE id = $1
        `,[userId])
    
          if (!user) {
          return res.status(404).json({ 
            success: false,
            error: 'Usuario no encontrado' 
          });
        }
        
        return res.json({
          success: true,
          user : {name : user.name, email : user.email}
        })
      }
      catch(error){
        console.error(error)
        return res.status(500).json({error : 'Error al obtener informacion del usuario'})
      }
      
}