import {
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

function mockHost() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({ getResponse: () => ({ status }) }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();

  it('mantém status e mensagem de uma HttpException', () => {
    const { host, status, json } = mockHost();

    filter.catch(new NotFoundException('Post não encontrado'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Post não encontrado' });
  });

  it('transforma o array de erros de validação na primeira mensagem', () => {
    const { host, status, json } = mockHost();

    filter.catch(
      new BadRequestException(['descrição obrigatória', 'type inválido']),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'descrição obrigatória' });
  });

  it('esconde detalhes de erros inesperados (500 genérico)', () => {
    const { host, status, json } = mockHost();
    jest.spyOn(filter['logger'], 'error').mockImplementation(() => undefined);

    filter.catch(new Error('conexão com o banco caiu'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'Erro interno do servidor' });
  });
});
