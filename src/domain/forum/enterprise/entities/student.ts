import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface StutentProps {
  nome: string
}

export class Student extends Entity<StutentProps> {
  get name() {
    return this.props.nome
  }

  // constructor(props: StutentProps, id?: string){
  //     super(props, id) // class Entity
  // }

  static create(props: StutentProps, id?: UniqueEntityID) {
    const student = new Student(
      {
        ...props,
      },
      id,
    )

    return student
  }
}
