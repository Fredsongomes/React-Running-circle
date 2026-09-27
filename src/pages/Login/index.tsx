import { useActionState } from 'react'
import { ArrowRight, ClipboardList } from 'lucide-react'
import bannerLogin from '../../assets/images/banner-login.png'
import AuthLayout from '../../components/AuthLayout'
import AuthLink from '../../components/AuthLink'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import Form from '../../components/Form'
import FormError from '../../components/FormError'
import FormField from '../../components/FormField'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Title from '../../components/Title'
import {useNavigate} from "react-router";
import {getErrorMessage} from "../../services/api.ts";
import {signIn} from "../../services/user.ts";

// O React 19 reseta o form após a action; guardamos os valores para
// repopular os campos quando o login falha (a senha é limpa de propósito).
type LoginState = {
    error: string | null
    values: { login: string; remember: boolean }
}

const initialState: LoginState = {
    error: null,
    values: { login: '', remember: false },
}

function Login() {

    const navigate = useNavigate()

    const [state, loginAction, isPending] = useActionState(
        async (_previousState: LoginState, formData: FormData): Promise<LoginState> => {
            const login = String(formData.get('login') ?? '').trim()
            const password = String(formData.get('password') ?? '')
            const remember = formData.get('remember') === 'on'
            const values = { login, remember }

            if (!login || !password) {
                return { error: 'Preencha todos os campos.', values }
            }

            try {
                await signIn({ login, password }, remember)
                navigate('/')
                return initialState
            } catch (err) {
                return { error: getErrorMessage(err, 'Login ou senha inválidos.'), values }
            }
        },
        initialState
    )

  return (
    <AuthLayout bannerImage={bannerLogin}>
      <Title>LOGIN</Title>
      <Text bold>Boas-vindas! Faça seu login.</Text>
      <Form action={loginAction}>
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
            autoComplete="current-password"
            required
          />
        </FormField>
        <Checkbox id="remember" name="remember" defaultChecked={state.values.remember}>
          Lembrar-me
        </Checkbox>
        <FormError>{state.error}</FormError>
        <Button type="submit" icon={<ArrowRight size={20} />} disabled={isPending}>
          {isPending ? 'Entrando...' : 'Login'}
        </Button>
      </Form>
      <AuthLink
        linkText="Crie seu cadastro!"
        icon={<ClipboardList size={20} />}
        to="/auth/cadastro"
      >
        Ainda não tem conta?
      </AuthLink>
    </AuthLayout>
  )
}

export default Login
