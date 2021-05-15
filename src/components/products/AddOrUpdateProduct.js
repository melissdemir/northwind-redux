import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCategories } from "../../redux/actions/categoryActions";
import { saveProduct } from "../../redux/actions/productActions";
import ProductDetail from "./ProductDetail";

function AddOrUpdateProduct({
  products,
  categories,
  getProducts,
  getCategories,
  saveProduct,
  history,
  ...props
}) {
  const [product, setProduct] = useState({ ...props.product });
  const [errors, setErrors] = useState({});
  /* statedeki producttı set product fonksiyonu ile state edebbiliriz */
  useEffect(() => {
    /* categoriler sayfası dolu gelmeyip kullanıcı link ile o sayfaya gitti ise  */
    if (categories.length === 0) {
      getCategories();
    }
    setProduct({ ...props.product });
  }, [props.product]);
  function handleChange(event) {
    /* handleChange ile bi event ile datayı dolduruyoruz */
    const {
      name,
      value,
    } = event.target; /* burada name value şekllinde bi event oluşturuldu ve bunun değeri event.target .... event target içerisindeki name ve value değerini atamış oluyoruz*/
    setProduct((previousProduct) => ({
      ...previousProduct /* bunun ile var olan producta kullanıcı tarafından girilen değerleri ekliyoruz */,
      [name]: name === "categoryId" ? parseInt(value, 10) : value,
    }));
    validate(name, value);
  }
  function validate(name, value) {
    if (name === "productName" && value === "") {
      setErrors((previousErrors) => ({
        ...previousErrors,
        productName: "Ürün ismi girmelisiniz",
      }));
    } else{
      setErrors((previousErrors) => ({
        ...previousErrors,
        productName: ""
      }));
    }
  }
  function handleSave(event) {
    event.preventDefault();
    saveProduct(product).then(() => {
      history.push(
        "/"
      ); /*daha önce geldiğimiz sayfalara yönlendirme yapmak için kullanırız*/
    });
  }
  return (
    <ProductDetail
      product={product}
      categories={categories}
      onChange={handleChange}
      onSave={handleSave}
      errors={errors}
    />
  );
}

export function getProductById(products, productId) {
  let product = products.find((product) => product.id == productId) || null;
  return product;
}
function mapStateToProps(state, ownProps) {
  const productId =
    ownProps.match.params.productId; /* parametrelere git ve productId çek */
  const product =
    productId && state.productListReducer.length > 0
      ? getProductById(state.productListReducer, productId)
      : {};
  return {
    product,
    products: state.productListReducer,
    categories: state.categoryListReducer,
  };
}
const mapDispatchToProps = {
  getCategories,
  saveProduct,
};
export default connect(mapStateToProps, mapDispatchToProps)(AddOrUpdateProduct);
