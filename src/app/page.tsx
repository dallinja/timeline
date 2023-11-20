import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-40">
      <Button variant="default">Click me</Button>
      <Button variant="error">Click me</Button>
      <Button variant="ghost">Click me</Button>
      <Button variant="link">Click me</Button>
      <Button variant="outline">Click me</Button>
      <Button variant="secondary">Click me</Button>
      <Text fontSize="lg" bold>
        Size
      </Text>
      <Button size="sm">Click me</Button>
      <Button size="default">Click me</Button>
      <Button size="lg">Click me</Button>
      <Button size="icon">$</Button>
    </div>
  )
}
