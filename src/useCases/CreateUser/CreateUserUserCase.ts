import { ICreateUserRequestDTO } from './CreateUserDTO';
import { IUsersRepository } from './../../repositories/IUsersRepository';
import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';
export class CreateUserUseCase {
    
    constructor(
        private usersRepository: IUsersRepository,
        private mailProvider: IMailProvider,
    ) { }
    
    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email)

        if(userAlreadyExists) {
            throw new Error('User already exists')
        }

        const user = new User(data)

        await this.usersRepository.save(user)

        this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email
            },
            from: {
                name: 'Equipe',
                email: 'teste@teste.com'
            },
            subject: 'Seja Bem Vindo',
            body: '<p>Teste</p>'
        })
    }
}