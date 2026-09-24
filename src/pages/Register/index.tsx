import { ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/AuthLayout'
import AuthLink from '../../components/AuthLink'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import Form from '../../components/Form'
import FormField from '../../components/FormField'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Title from '../../components/Title'

function Register() {
  return (
    <AuthLayout bannerImage="/images/banner-register.png">
      <Title>CADASTRO</Title>
      <Text bold>Junte-se à nossa comunidade!</Text>
      <Text>Preencha seus dados:</Text>
      <Form>
        <FormField label="Nome" htmlFor="name">
          <Input id="name" placeholder="Seu nome" />
        </FormField>
        <FormField label="Email ou usuário" htmlFor="email">
          <Input id="email" type="email" placeholder="usuario123@hotmail.com" />
        </FormField>
        <FormField label="Senha" htmlFor="password">
          <Input id="password" type="password" placeholder="******" />
        </FormField>
        <Checkbox id="remember">Lembrar-me</Checkbox>
        <Button type="submit" icon={<ArrowRight size={20} />}>
          Cadastrar
        </Button>
      </Form>
      <AuthLink linkText="Faça seu login!">Já tem conta?</AuthLink>
    </AuthLayout>
  )
}

export default Register
