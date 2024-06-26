import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answers'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AwnserQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  attachmentsIds: string[]
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
    attachmentsIds,
  }: AwnserQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachment = attachmentsIds.map((attachmentsIds) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsIds),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachment)

    await this.answerRepository.create(answer)

    return right({
      answer,
    })
  }
}
