import typia, { type tags } from "typia"

/** define the schema of the member */
interface IMember {
  /**
  * email of the member
  */
  email: string & tags.Format<"email">;

  /**
  * age of the member
  * age should be greater than 19
  */
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

/** dummy member */
const member = {
  email: 'example@example.com',
  age: 25
} as const satisfies IMember

console.log({ member, is: typia.is<IMember>(member) })

console.log({
  random: typia.random<IMember>(),
})
