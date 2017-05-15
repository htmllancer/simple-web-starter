import Basket from './basket'

let privateFunction = () => {
  console.warn('privateFunction')
}

let PS = {
  'Basket': Basket,
  test: () => {
    privateFunction()
  }
}
export default PS
