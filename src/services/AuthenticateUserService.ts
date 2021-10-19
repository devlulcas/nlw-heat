import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
/*
 * Receber code
 * Recuperar access_token no github
 * Recuperar infos do usuário no github
 * Verificar se o usuário existe no db
 * Se ele existir, geramos um token
 * Se não existir, criamos ele no db e geramos um token
 * No fim retornamos o token com as informações do usuário
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "http://github.com/login/oauth/access_token";
    // Envia (post) o código do usuário e as nossas informações
    // para acessar a api e permitir que possamos futuramente
    // receber os dados do usuário que logou com o github.
    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

    // Depois de enviar a informações para o github podemos
    // receber de volta (get) as informações do usuário.
    // Usamos uma interface para pegar apenas as informações
    // pertinentes para nossa aplicação.
    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    // Desestruturando o que recebemos na response para obter
    // separadamente cada uma de nossas informações
    const { login, id, avatar_url, name } = response.data;

    // Fazendo uma consulta no banco de dados usando o prisma
    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    // Se não houver usuário nós criamos ele
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });
    }

    // Agora criamos o JWT
    const secretSignature = process.env.JWT_SIGNATURE;
    const token = sign(
      // Payload
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      // Assinatura
      secretSignature,
      // Informações extra
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );
    
    // Retornamos o token e o usuário para quem fizer a requisição
    return { token, user };
  }
}

export { AuthenticateUserService };
