'use client'

import { itemOrder } from "@/types/types";
import { useCart } from '@/utils/useCart';
import { Button, Divider, Image, Select, SelectProps, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Epilogue } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ShortUniqueId from 'short-unique-id';
import styles from "../css/button.module.css";

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

const paymentTerms = [
    { value: "full", label: 'Full Payment + ₱99.00 Shipping Fee' },
    { value: "down before shipping", label: '50% Down Payment & 50% Before Shipping + ₱99.00 Shipping Fee' },
    { value: "down cod", label: '50% Down Payment & 50% Cash on Delivery + ₱250.00 Shipping Fee via LBC only' },
    { value: "3 months", label: '3 months lay-away' },
]

const couriers = [
    { value: "lalamove", label: 'Lalamove' },
    { value: "pick-up", label: 'LBC Branch Pick-Up' },
    { value: "door-to-door", label: 'LBC Branch Door-to-Door' },
]

export default function Checkout() {
    const { cart } = useCart();
    const [payMethod, setPayMethod] = useState<string>('BDO');
    const [selectedTerm, setSelectedTerm] = useState(paymentTerms[0]);
    const [selectedCouriers, setSelectedCouriers] = useState(couriers[0]);
    const [addFees, setAddFees] = useState<number>(99.00);
    const [paymentImage, setPaymentImage] = useState<string>("/BDO.png");
    const [term, setTerm] = useState<string>("Full Payment");
    const [qr, setQr] = useState<string>("/bdo qr.jpg");
    const [cartItems, setCartItems] = useState<itemOrder[]>();
    const [totalPrice, setTotalPrice] = useState<number>();

    const router = useRouter();

    const getTotalPrice = () => {
        let totalPrice = 0;

        cart.map((item) => {
            totalPrice += (item.product.Price * item.quantity);
        })

        return totalPrice;
    }

    useEffect(() => {
        setTotalPrice(getTotalPrice());
        setCartItems(cart);

        form.setFieldValue("total_price", getTotalPrice());
        form.setFieldValue("cartItems", cart);
    }, [cart])
    
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: "",
            firstname: '',
            lastname: '',
            email: '',
            phone: "",
            street: "",
            city: "",
            province: "",
            zipcode: "",
            paymentMethod: "BDO",
            term: 1,
            courier: "Lalamove",
            notes: "",
            total_price: totalPrice,
            cartItems: cartItems
        },

        validate: {
            firstname: (value) => (value.length < 1 ? 'First name should not be empty' : null),
            lastname: (value) => (value.length < 1 ? 'Last name should not be empty' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => (/^09\d{2} \d{3} \d{4}$/.test(value) ? null : 'Phone number must be in the format 09X XXX XXXX'),
            street: (value) => (value.length < 1 ? 'Street address should not be empty' : null),
            city: (value) => (value.length < 1 ? 'City name should not be empty' : null),
            province: (value) => (value.length < 1 ? 'Province name should not be empty' : null),
            zipcode: (value) => (value.length < 4 || value.length >= 5 ? 'Input a valid zipcode' : null),
        },
    });

    const submitInfo = async () => {
        if (form.validate().hasErrors) {
            console.log('Validation failed:', form.errors);
        } else {
            console.log('Form values:', form.getValues());
            const uid = new ShortUniqueId({ length: 10 });
            const generatedId = uid.rnd();

            form.setFieldValue("id", "O-" + generatedId);
            const response = await fetch('api/orders/add_order', {
                method: "POST",
                body: JSON.stringify(form.getValues())
            });

            const result = await response.json();
            console.log(result);
            router.push(`/orderslip/O-${generatedId}`);
        }
    }

    useEffect(() => {
        console.log("cart", cart);
    }, [cart]);

    const handlePaymentChange = (value: string | null) => {
        if (value) {
            const selected = paymentTerms.find((term) => term.value === value);
            if (selected) {
                setSelectedTerm(selected);

                if (selected.value != "3 months" && selected.value != "down cod") {
                    setAddFees(99.00);
                }
                else if (selected.value === "down cod") {
                    setAddFees(250.00)
                }
                else {
                    setAddFees(0.00);
                }

                if (selected.value === "full") {
                    setTerm("Full Payment");
                    form.setFieldValue("term", 1);
                }
                else if (selected.value === "down before shipping") {
                    setTerm("50% Down Payment & 50% Before Shipping");
                    form.setFieldValue("term", 2);
                }
                else if (selected.value === "down cod") {
                    setTerm("50% Down Payment & 50% Cash on Delivery");
                    form.setFieldValue("term", 3);
                }
                else if (selected.value === "3 months") {
                    setTerm("3 months lay-away");
                    form.setFieldValue("term", 4);
                }
            }
        } else {
            setSelectedTerm(paymentTerms[0]);
        }
    };

    const handleCourierChange = (value: string | null) => {
        if (value) {
            const selected = couriers.find((term) => term.value === value);
            if (selected) {
                setSelectedCouriers(selected);
                form.setFieldValue("courier", selected.label);
            }
        } else {
            setSelectedCouriers(couriers[0]);
            form.setFieldValue("courier", couriers[0].label);
        }
    };

    const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
        const [mainText, feeText] = option.label.split('+');
        const [topText, bottomText] = mainText.split('&');
        return (
            <div className="w-full flex flex-col">
                <div className="w-full" style={{ padding: '10px' }}>
                    <div style={{ color: "#474747", fontSize: "0.875rem", fontWeight: "600" }}>{topText.trim()}<span>{bottomText ? " &" : ""}</span></div>
                    <div style={{ color: "#474747", fontSize: "0.875rem", fontWeight: "600" }}>{bottomText}</div>
                    {feeText && (
                        <div style={{ color: '#2E7D31', fontSize: '0.875rem', marginTop: '2px' }}>
                            +{feeText.trim()}
                        </div>
                    )}
                </div>

                {mainText != "3 months lay-away" && (
                    <Divider orientation='horizontal' className='w-full mt-3 border-[#B1B1B180]' />
                )}
            </div>
        );
    }

    const renderCourier: SelectProps['renderOption'] = ({ option }) => {
        let mainText = option.label;
        let subText = "";
        if (option.label.includes("Pick-Up")) {
            mainText = "LBC Branch";
            subText = "Pick-Up"
        }
        else if (option.label.includes("Door-to-Door")) {
            mainText = "LBC Branch";
            subText = "Door-to-Door"
        }

        return (
            <div className="w-full flex flex-col">
                <div className="w-full" style={{ padding: '10px' }}>
                    <div style={{ color: "#474747", fontSize: "0.875rem", fontWeight: "600" }}>{mainText.trim()}</div>
                    {subText && (
                        <div style={{ color: '#2E7D31', fontSize: '0.875rem', marginTop: '2px' }}>
                            {subText.trim()}
                        </div>
                    )}
                </div>

                {subText != "Door-to-Door" && (
                    <Divider orientation='horizontal' className='w-full mt-3 border-[#B1B1B180]' />
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col p-3 items-start mt-20 mx-20 relative z-50 bg-white overflow-x-hidden min-h-screen">
            <Button
                component="a"
                href="/cart"
                variant="filled"
                fullWidth
                color="black"
                radius="md"
                className="hover:outline hover:outline-offset-2 hover:outline-dark-gray shadow-lg"
                styles={{
                    root: {
                        height: "46px",
                        width: "207px",
                        marginRight: "auto",
                        marginBottom: "40px"
                    },
                    label: {
                        fontFamily: "Epilogue",
                        fontWeight: 700,
                        fontSize: "20px",
                        color: "#EDEDED"
                    }
                }}
            >
                Return
            </Button>

            <p style={epilogue.style} className="tracking-tighter text-[4.5rem] font-bold">Checkout</p>

            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col w-[80%] mr-10 mt-[4.63vh] h-auto">
                    <div className="w-full h-[7.778vh] bg-[#474747] rounded-lg flex items-center justify-start px-10">
                        <p style={epilogue.style} className="text-[1.5rem] font-bold text-white">Personal Information</p>
                    </div>
                    <SimpleGrid cols={2}>
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh] w-full"
                            label="First Name"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('firstname')}
                        />
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh] w-full "
                            label="Last Name"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('lastname')}
                        />
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh] w-full"
                            label="Email Address"
                            type="email"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('email')}
                        />
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh] w-full"
                            label="Phone Number"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('phone')}
                        />
                    </SimpleGrid>
                    <div className="w-full h-[7.778vh] mt-[4.63vh] bg-[#474747] rounded-lg flex items-center justify-start px-10">
                        <p style={epilogue.style} className="text-[1.5rem] font-bold text-white">Shipping Address</p>
                    </div>
                    <TextInput
                        className="font-normal text-[14px] pt-[2.778vh] w-full"
                        label="Street Address"
                        required
                        style={epilogue.style}
                        styles={{
                            label: {
                                color: "#474747B3",
                                fontSize: "1.25 rem"
                            },
                            input: {
                                borderColor: "#474747"
                            }
                        }}
                        {...form.getInputProps('street')}
                    />
                    <SimpleGrid cols={3}>
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh]"
                            label="City"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('city')}
                        />
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh]"
                            label="Province"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('province')}
                        />
                        <TextInput
                            className="font-normal text-[14px] pt-[2.778vh]"
                            label="Zip Code"
                            required
                            style={epilogue.style}
                            styles={{
                                label: {
                                    color: "#474747B3",
                                    fontSize: "1.25 rem"
                                },
                                input: {
                                    borderColor: "#474747"
                                }
                            }}
                            {...form.getInputProps('zipcode')}
                        />
                    </SimpleGrid>
                    <div className="w-full h-[7.778vh] mt-[4.63vh] bg-[#474747] rounded-lg flex items-center justify-start px-10">
                        <p style={epilogue.style} className="text-[1.5rem] font-bold text-white">Payment Method & Courier</p>
                    </div>

                    <div className="justify-between flex flex-row">
                        <div className="flex flex-col w-[60%]">
                            <p style={epilogue.style} className="mt-[2.778vh] text-[1.25 rem] font-normal text-[#474747B3]">Payment Method<span className="text-[#fa5252]"> *</span></p>
                            <SimpleGrid cols={3} className="mb-5">
                                <Button
                                    className={`${styles.button} ${payMethod === "BDO" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("BDO"); setPaymentImage("/BDO.png"); setQr("/bdo qr.jpg"); form.setFieldValue("paymentMethod", "BDO"); }}
                                >
                                    <Image
                                        src="/BDO.png"
                                        w="auto"
                                    />
                                </Button>
                                <Button
                                    className={`${styles.button} ${payMethod === "BPI" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("BPI"); setPaymentImage("/BPI.png"); setQr("/bpi qr.jpg"); form.setFieldValue("paymentMethod", "BPI"); }}
                                >
                                    <Image
                                        src="/BPI.png"
                                        w="auto"
                                    />
                                </Button>
                                <Button
                                    className={`${styles.button} ${payMethod === "Metrobank" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("Metrobank"); setPaymentImage("/Metrobank.png"); setQr("/metrobank qr.jpg"); form.setFieldValue("paymentMethod", "Metrobank"); }}
                                >
                                    <Image
                                        src="/Metrobank.png"
                                        w="auto"
                                    />
                                </Button>
                                <Button
                                    className={`${styles.button} ${payMethod === "UnionBank" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("UnionBank"); setPaymentImage("/UnionBank.png"); setQr("/unionbank qr.jpg"); form.setFieldValue("paymentMethod", "UnionBank"); }}
                                >
                                    <Image
                                        src="/UnionBank.png"
                                        w="auto"
                                    />
                                </Button>
                                <Button
                                    className={`${styles.button} ${payMethod === "GCash" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("GCash"); setPaymentImage("/gcash.png"); setQr("/gcash qr.jpg"); form.setFieldValue("paymentMethod", "GCash"); }}
                                >
                                    <Image
                                        src="/gcash.png"
                                        w="auto"
                                    />
                                </Button>
                                <Button
                                    className={`${styles.button} ${payMethod === "Maya" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("Maya"); setPaymentImage("/Maya.png"); setQr("/maya qr.jpg"); form.setFieldValue("paymentMethod", "Maya"); }}
                                >
                                    <Image
                                        src="/Maya.png"
                                        w="auto"
                                    />
                                </Button>
                                <Button
                                    className={`${styles.button} ${payMethod === "PayPal" ? styles.activeButton : styles.button}`}
                                    color="white"
                                    onClick={() => { setPayMethod("PayPal"); setPaymentImage("/PayPal.png"); setQr("https://www.paypal.me/paradisekicks"); form.setFieldValue("paymentMethod", "PayPal"); }}
                                >
                                    <Image
                                        src="/PayPal.png"
                                        w="auto"
                                    />
                                </Button>
                            </SimpleGrid>
                            <SimpleGrid cols={2} className="mb-10">
                                <Select
                                    label="Payment Terms"
                                    required
                                    data={paymentTerms}
                                    value={selectedTerm.value}
                                    onChange={handlePaymentChange}
                                    style={epilogue.style}
                                    renderOption={renderSelectOption}
                                    allowDeselect={false}
                                />
                                <Select
                                    label="Preferred Courier"
                                    required
                                    data={couriers}
                                    value={selectedCouriers.value}
                                    onChange={handleCourierChange}
                                    style={epilogue.style}
                                    renderOption={renderCourier}
                                    allowDeselect={false}
                                />
                            </SimpleGrid>
                            <p style={epilogue.style} className="mt-[2.778vh] text-[1.25 rem] font-normal text-[#474747B3]">Payment Guidelines</p>
                            <div className="bg-[#FBC02D33] w-full 2xl:h-[12.5vh] 3xl:h-[10vh] rounded-lg flex flex-row p-5 items-center justify-center mb-12">
                                <Image
                                    className="ml-3"
                                    src="/warning.svg"
                                />
                                <p className="mx-6" style={epilogue.style}>The <span style={epilogue.style} className="font-semibold">generated invoice slip</span> after proceeding this page <span style={epilogue.style} className="font-semibold">should be sent to our Facebook Page or Viber.</span></p>
                            </div>
                        </div>
                        <div className="w-[50%] ml-20 mt-[2.778vh]">
                            <p style={epilogue.style} className="text-[1.25 rem] font-normal text-[#474747B3]">Payment Portal</p>
                            {payMethod === "PayPal" ? (
                                <p style={epilogue.style} className="text-[1rem] mt-[2.778vh] font-normal w-full">{qr}</p>
                            ) : (
                                <Image
                                    src={qr}
                                    className="w-full mt-[2.778vh]"
                                />
                            )}

                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[31.25vw] h-fit mt-[4.63vh] rounded-lg border-[1px] p-10 border-[#474747]">
                    <p style={epilogue.style} className="text-[2rem] font-bold leading-none">Order Summary</p>

                    <SimpleGrid cols={2} className="mt-10 items-center">
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-bold">Sub Total</p>
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-normal pl-10">&#8369; {getTotalPrice().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-bold">Additional Fees</p>
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-normal pl-10">&#8369;  {addFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </SimpleGrid>

                    <Divider orientation='horizontal' className='w-full mt-3 border-[#B1B1B180]' />

                    <SimpleGrid cols={2} className="mt-10 items-center">
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-bold">Total</p>
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-normal pl-10">&#8369; {(getTotalPrice() + addFees).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </SimpleGrid>

                    <SimpleGrid cols={2} className="mt-10 items-center">
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-bold h-[60px]">Payment Method</p>
                        <div className="h-[60px]">
                            <Image
                                src={paymentImage}
                                w="auto"
                                className="pl-10"
                            />
                        </div>
                    </SimpleGrid>

                    <SimpleGrid cols={2} className="mt-2 items-center">
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-bold">Payment Term</p>
                        <p style={epilogue.style} className="text-[0.875rem] leading-none font-normal pl-10">{term}</p>
                    </SimpleGrid>

                    <SimpleGrid cols={2} className="mt-10 items-center">
                        <p style={epilogue.style} className="text-[1.25rem] leading-none font-bold">Courier</p>
                        <p style={epilogue.style} className="text-[0.875rem] leading-none font-normal pl-10">{selectedCouriers.label}</p>
                    </SimpleGrid>

                    <Textarea
                        placeholder="Additional Notes"
                        autosize
                        minRows={5}
                        maxRows={5}
                        className="my-5"
                        {...form.getInputProps('notes')}
                    />

                    <Button
                        variant="filled"
                        fullWidth
                        color="#2E7D31"
                        radius="md"
                        onClick={submitInfo}
                        styles={{
                            root: {
                                height: "7.222vh",
                                marginRight: "auto",
                                marginBottom: "40px"
                            },
                            label: {
                                fontFamily: "Epilogue",
                                fontWeight: 700,
                                fontSize: "1.3rem",
                                color: "#EDEDED"
                            }
                        }}
                    >
                        Submit
                    </Button>

                </div>
            </div>
        </div>
    )
}