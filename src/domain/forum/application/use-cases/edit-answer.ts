import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answers'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  async execute({
    authorId,
    content,
    answerId,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachment = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachment)

    answer.attachments = answerAttachmentList

    answer.content = content

    await this.answerRepository.save(answer)

    return right({
      answer,
    })
  }
}
