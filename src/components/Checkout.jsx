import Modal from "./UI/Modal.jsx";
import {useContext} from "react";
import CartContext from "../store/CartContext.jsx";
import {currencyFormatter} from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";
import Button from "./UI/Button.jsx";
import Error from "./Error.jsx";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
}
export default function Checkout() {
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)

    const {
        data,
        isLoading: isSending,
        error,
        sendRequest,
        clearData
    } = useHttp('http://localhost:3000/orders', requestConfig)

    const totalCart = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

    function handleClose() {
        userProgressCtx.hideCheckOut()
    }

    function handleFinish() {
        userProgressCtx.hideCheckOut()
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event) {
        event.preventDefault();

        //getting the forms data
        const fd = new FormData(event.target)
        const formData = Object.fromEntries(fd.entries())  // { email:eamil@gamil.com}

        sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: formData
            }
        }))
    }

    let actions = (
        <>
            <Button type='button' textOnly onClick={handleClose}>Close</Button>
            <Button>Submit Order</Button>
        </>
    )

    if (isSending) {
        actions = <span>Sending order data ...</span>
    }

    if (data && !error) {
        return <Modal
            open={userProgressCtx.progress === 'checkout'}
            onClose={handleClose}
        >
            <h2>Success!</h2>
            <p>Your order is submited successfully!</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>okay!</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(totalCart)}</p>
            <Input label="Full Name" type="text" id="name"/>
            <Input label="E-mail Address" type="email" id="email"/>
            <Input label="Street" type="text" id="street"/>
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code"/>
                <Input label="City" type="text" id="city"/>
            </div>
            {error && <Error title="Failed to submit the order" message={error.message}/>}
            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}