import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answers'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'

interface AwnserQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

// DRY - Don't repeat your self

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  // Erro no eslint -> como ele identifica que o construtor está vazio, alerta um erro
  // Mas isso é valido no typescript então basta criar uma regra no .eslint.json

  async execute({
    instructorId,
    questionId,
    content,
  }: AwnserQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.answerRepository.create(answer)

    return right({
      answer,
    })
  }
}
