import { useActionState } from 'react'
import { ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/AuthLayout'
import AuthLink from '../../components/AuthLink'
import Button from '../../components/Button'
import Form from '../../components/Form'
import FormError from '../../components/FormError'
import FormField from '../../components/FormField'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Title from '../../components/Title'
import {useNavigate} from "react-router";
import {getErrorMessage} from "../../services/api.ts";
import {createUser} from "../../services/user.ts";

type RegisterState = {
    error: string | null
    values: { name: string; login: string }
}

const initialState: RegisterState = {
    error: null,
    values: { name: '', login: '' },
}

function Register() {

    const navigate = useNavigate()

    const [state, registerAction, isPending] = useActionState(
        async (_previousState: RegisterState, formData: FormData): Promise<RegisterState> => {
            const name = String(formData.get("name") ?? "").trim()
            const login = String(formData.get("login") ?? "").trim()
            const password = String(formData.get("password") ?? "")
            const values = { name, login }

            if (!name || !login || !password) {
                return { error: "Preencha todos os campos.", values }
            }

            if (password.length < 6) {
                return { error: "A senha precisa de ao menos 6 caracteres.", values }
            }

            try {
                await createUser({ name, login, password })

                navigate('/auth/login')
                return initialState
            } catch (err) {
                return {
                    error: getErrorMessage(err, "Não foi possível criar sua conta. Tente novamente."),
                    values,
                }
            }
        },
        initialState
    )

  return (
    <AuthLayout bannerImage="/images/banner-register.png">
      <Title>CADASTRO</Title>
      <Text bold>Junte-se à nossa comunidade!</Text>
      <Text>Preencha seus dados:</Text>
      <Form action={registerAction}>
        <FormField label="Nome" htmlFor="name">
          <Input
            id="name"
            name="name"
            placeholder="Seu nome"
            defaultValue={state.values.name}
            required
          />
        </FormField>
        <FormField label="Email ou usuário" htmlFor="login">
          <Input
            id="login"
            name="login"
            placeholder="usuario123@hotmail.com"
            autoComplete="username"
            defaultValue={state.values.login}
            required
          />
        </FormField>
        <FormField label="Senha" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="******"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </FormField>
        <FormError>{state.error}</FormError>
        <Button type="submit" icon={<ArrowRight size={20} />} disabled={isPending}>
          {isPending ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </Form>
      <AuthLink
          linkText="Faça seu login!"
          to="/auth/login"
      >
          Já tem conta?
      </AuthLink>
    </AuthLayout>
  )
}

export default Register
