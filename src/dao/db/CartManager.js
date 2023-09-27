import { cartsModel } from '../models/carts.model.js';
import { productsModel } from '../models/products.model.js';

class CartManager {

  async addCart() {
    let cart2 = {}
    try {
      cart2 = { products: [] }
      const carnnew = await cartsModel.create(cart2)
      return `SUC|Carrito agregado con el id ${carnnew._id}`

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async addCartProducts(pid, cid) {

    try {
      console.log("entro enaddcartproducts")

      const cartObject = await cartsModel.findById({ _id: cid })
      if (cartObject == undefined || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

      const productObject = await productsModel.find({ _id: pid })

      if (productObject == undefined || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

      if (cartObject.products.find(prod => prod.id == pid)) {
        let ProductinsideCart = cartObject.products.find(prod => prod.id == pid)

        ProductinsideCart.quantity += 1

        cartObject.save();

        return `SUC|Producto sumado al carrito con el producto ya existente`
      }
      cartObject.products.push({ id: pid, quantity: 1 });

      await cartObject.save();

      return `SUC|Producto agregado al carrito ${cid}`

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getCarts() {
    try {
      const allCarts = await cartsModel.find();
      return allCarts

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getCartById(cid) {
    try {

      const CartById = await cartsModel.find({ _id: cid }).lean()

      if (CartById == undefined) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

      return CartById

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async getProductsinCartById(cid) {
    try {
      console.log("entro en el getProductsinCartById dentro de cartmanager")

      // const CartById = await cartsModel.find({ _id: cid }).lean()

      // const CartById = await cartsModel.find({
      //   "_id": cid
      // }, {
      //   "products": {
      //     "_id": 1,
      //     "id": 1,
      //     "title": 1,
      //     "category": 1
      //   }
      // }).lean()
      const cartObject = await cartsModel.find({ _id: cid }).lean()
      const products = cartObject[0].products;
      // const cartObject = await cartsModel.findById({ _id: cid })

       console.log(cartObject)

      // console.log(JSON.stringify(cartObject))
      // const objectstringify = JSON.stringify(cartObject);

      // console.log(products)

      // let ProductinsideCart = cartObject.products
      // console.log(objectstringify)
      // console.log(ProductinsideCart)

      // console.log(ProductinsideCart)

      // if (CartById == undefined) return `E02|El carro con el id ${cid} no se encuentra agregado.`;
      // const products = CartById.products;
      // console.log(products)

      return products

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteCart(cid) {
    try {

      await cartsModel.deleteOne({ _id: cid })

      return `SUC|El carrito con el id ${cid} fue eliminado.`
    }
    catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteCartProduct(pid, cid) {
    const CartById = await cartsModel.findById({ _id: cid })
    let ProductinsideCart = CartById.products.find(prod => prod.id == pid)

    if (ProductinsideCart) {
      await CartById.products.pull(ProductinsideCart);
      await CartById.save();
      return `SUC|Producto eliminado del carrito`
    } else {
      return `E02|El producto con el id ${pid} no se encuentra agregado.`;
    }
  }

  async deleteAllCartProducts(cid) {

    const CartById = await cartsModel.findById({ _id: cid })
    if (CartById == undefined || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

    const response = await cartsModel.updateOne(
      { "_id": cid },
      { $set: { products: [] } }
    )
    return `SUC|Productos eliminados del carrito ${cid}`

  }

  async updateCartProductQuantity(pid, cid, quantity_) {
    let { quantity } = quantity_;

    const cartObject = await cartsModel.findById({ _id: cid })
    if (cartObject == undefined || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

    const productObject = await productsModel.find({ _id: pid })
    if (productObject == undefined || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

    let updateObject = await cartsModel.updateOne({
      "_id": cid,
      "products.id": pid
    }, {
      $set: {
        "products.$.quantity": quantity
      }
    })
    if (updateObject.modifiedCount > 0) {
      return `SUC|Producto actualizado del carrito`
    } else {
      return `E02|No se pudo actualizar el productocon el id ${pid}`;
    }
  }
}

export default CartManager;



