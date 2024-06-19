import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: EditQuestionUseCase

describe('Edit QUestion by id', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('Should be possible edit a question with a id', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      content: 'Conteudo Teste',
      title: 'Pergunta teste',
      authorId: 'author-1',
      questionId: newQuestion.id.toValue(),
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Pergunta teste',
      content: 'Conteudo Teste',
    })
  })

  it('Should not be possible edit a question when you not a author of this question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      content: 'Conteudo Teste',
      title: 'Pergunta teste',
      authorId: 'author-2',
      questionId: newQuestion.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
