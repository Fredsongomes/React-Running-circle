import { ArrowRight, ClipboardList } from 'lucide-react'
import AuthLayout from '../../components/AuthLayout'
import AuthLink from '../../components/AuthLink'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import Form from '../../components/Form'
import FormField from '../../components/FormField'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Title from '../../components/Title'

function Login() {
  return (
    <AuthLayout bannerImage="/images/banner-login.png">
      <Title>LOGIN</Title>
      <Text bold>Boas-vindas! Faça seu login.</Text>
      <Form>
        <FormField label="Email ou usuário" htmlFor="email">
          <Input id="email" type="email" placeholder="usuario123@hotmail.com" />
        </FormField>
        <FormField label="Senha" htmlFor="password">
          <Input id="password" type="password" placeholder="******" />
        </FormField>
        <Checkbox id="remember">Lembrar-me</Checkbox>
        <Button type="submit" icon={<ArrowRight size={20} />}>
          Login
        </Button>
      </Form>
      <AuthLink
        linkText="Crie seu cadastro!"
        icon={<ClipboardList size={20} />}
      >
        Ainda não tem conta?
      </AuthLink>
    </AuthLayout>
  )
}

export default Login
