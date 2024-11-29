'use client'
import { FaqsType } from '@/types/types';
import { Modal, UnstyledButton } from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { Epilogue } from 'next/font/google';
import { useEffect, useState } from 'react';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})


export default function FAQs() {
    const [faqs, setFaqs] = useState<FaqsType[]>([]);
    const [editMode, setEditMode] = useState<number | null>(null); 
    const [editedFaq, setEditedFaq] = useState<FaqsType | null>(null); 
    //const [opened, { open, close }] = useDisclosure(false);
    const [openedNewQuestion, setOpenedNewQuestion] = useState(false);
    const [openedDeleteFaq, setOpenedDeleteFaq] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");


    const openNewQuestionModal = () => setOpenedNewQuestion(true);

    const closeNewQuestionModal = () => {
        setNewQuestion("");
        setNewAnswer("");
        setOpenedNewQuestion(false);
    }

    const openDeleteFaqModel = () => setOpenedDeleteFaq(true);

    const closeDeleteFaqModel = () => setOpenedDeleteFaq(false);


    const editButton = (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2217 4.10228L22.561 1.76161C23.0486 1.27396 23.71 1 24.3997 1C25.0893 1 25.7507 1.27396 26.2384 1.76161C26.726 2.24927 27 2.91066 27 3.60031C27 4.28995 26.726 4.95135 26.2384 5.439L11.5136 20.1638C10.7805 20.8965 9.87644 21.435 8.8831 21.7307L5.15994 22.8401L6.26926 19.1169C6.565 18.1236 7.10352 17.2195 7.83618 16.4864L20.2217 4.10228ZM20.2217 4.10228L23.8797 7.76025M21.7997 17.2935V23.88C21.7997 24.7075 21.471 25.5011 20.8859 26.0862C20.3008 26.6713 19.5072 27 18.6798 27H4.11996C3.29249 27 2.49892 26.6713 1.91381 26.0862C1.32871 25.5011 1 24.7075 1 23.88V9.32023C1 8.49277 1.32871 7.69919 1.91381 7.11409C2.49892 6.52898 3.29249 6.20027 4.11996 6.20027H10.7065" stroke="#2E7D31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        );
        

    const deleteButton = (<svg width="25" height="29" viewBox="0 0 25 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.2675 10.375L15.7918 22.75M9.20825 22.75L8.7325 10.375M22.4385 5.96123C22.9088 6.03273 23.3762 6.10836 23.8438 6.18948M22.4385 5.96123L20.97 25.0504C20.9101 25.8275 20.559 26.5535 19.9869 27.0829C19.4148 27.6124 18.664 27.9065 17.8845 27.9062H7.1155C6.33601 27.9065 5.58516 27.6124 5.0131 27.0829C4.44104 26.5535 4.08993 25.8275 4.03 25.0504L2.5615 5.96123M22.4385 5.96123C20.8516 5.72132 19.2564 5.53924 17.6562 5.41536M2.5615 5.96123C2.09125 6.03136 1.62375 6.10698 1.15625 6.18811M2.5615 5.96123C4.14843 5.72132 5.74357 5.53924 7.34375 5.41536M17.6562 5.41536V4.15586C17.6562 2.53336 16.405 1.18036 14.7825 1.12948C13.2612 1.08086 11.7388 1.08086 10.2175 1.12948C8.595 1.18036 7.34375 2.53473 7.34375 4.15586V5.41536M17.6562 5.41536C14.2239 5.15009 10.7761 5.15009 7.34375 5.41536" stroke="#E53835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        );
    
    
    const plusIcon = (<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 5.8125V25.1875M25.1875 15.5H5.8125" stroke="#38BDBA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        );

    // fetch faqs
    const getFaqs = async () => {
        const response = await fetch(`/api/faqs/get_faqs`, { method: "GET" });
        const result = await response.json();

        if (result.faqs.length) {
            const fetchedFaqs = result.faqs.map((faq: FaqsType) => ({
                id: faq.id,
                question: faq.question,
                answer: faq.answer,
            }));
            setFaqs(fetchedFaqs);
        } else {
            console.log("FAQs not found");
        }
    };


    useEffect(() => {
        getFaqs();
    }, []);


    const handleEditClick = (faq: FaqsType) => {
        setEditMode(faq.id);
        setEditedFaq({ ...faq });
    };

    const handleCancelEdit = () => {
        setEditMode(null);
        setEditedFaq(null);
    };

    // update faqs
    const handleSaveEdit = async () => {
        if (!editedFaq) return;
    
        try {
            const response = await fetch(`/api/faqs/update_faqs`, {
                method: "POST",
                body: JSON.stringify({ updatedFaq: editedFaq })
            });
    
            const result = await response.json();
    
            if (result.success) {
                setFaqs((prevFaqs) =>
                    prevFaqs.map((faq) => (faq.id === editedFaq.id ? editedFaq : faq))
                );
                setEditMode(null);
                setEditedFaq(null);
                notifications.show({
                    message: "FAQ successfully updated!",
                    color: "green"
                });
            } else {
                console.error("Failed to update FAQ:", result.error);
                notifications.show({
                    message: "Failed to update FAQ.",
                    color: "red"
                });
            }
        } catch (error) {
            console.error("Error while updating FAQ:", error);
            notifications.show({
                message: "Failed to update FAQ.",
                color: "red"
            });
        }
    };
    

    const handleInputChange = (field: keyof FaqsType, value: string) => {
        if (!editedFaq) return;
        setEditedFaq({ ...editedFaq, [field]: value });
    };


    // delete faqs
    const deleteFaq = async (faqId: number) => {
        const response = await fetch(`/api/faqs/delete_faqs`, {
            method: "POST",
            body: JSON.stringify({ faqId })
        });

        const result = await response.json();

        if (result.success) {
            notifications.show({
                message: "FAQ successfully deleted!",
                color: "green"
            });
            getFaqs();
        } else {
            console.error("Failed to delete FAQ:", result.error);
            notifications.show({
                message: "Failed to delete FAQ.",
                color: "red"
            });
        }
    }


    // add faqs
    const handleAddQuestion = async () => {
        if (!newQuestion || !newAnswer) {
            notifications.show({
                message: "Please provide a question and answer",
                color: "yellow"
            });
            return;
        }
    
        try {
            const response = await fetch(`/api/faqs/add_faqs`, {
                method: "POST",
                body: JSON.stringify({ question: newQuestion, answer: newAnswer })
            });
    
            const result = await response.json();
            
            if (result.success) {
                setNewQuestion("");  
                setNewAnswer("");  
                closeNewQuestionModal(); 
                notifications.show({
                    message: "Successfully added new FAQ!",
                    color: "green"
                });
                getFaqs();
            } else {
                console.log("Failed to add FAQ");
                notifications.show({
                    message: "Failed to add FAQ.",
                    color: "red"
                });
            }
        } catch (error) {
            console.log("Error adding FAQ: ", error);
        }
    };
    

    return (
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col items-start justify-start">
                    <p style={epilogue.style} className="text-[72px] font-bold mb-6">
                        FAQs
                    </p>
                </div>
            </div>
            <Notifications />

            <div className="flex flex-col items-center justify-start w-[85%]">
                <Modal 
                    opened={openedNewQuestion} 
                    onClose={closeNewQuestionModal} 
                    size="70%"
                    overlayProps={{
                        backgroundOpacity: 0.1
                    }}
                    centered
                    withCloseButton={false}
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }} className="flex flex-col items-center justify-center">
                        <input
                            type="text"
                            placeholder="Question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.currentTarget.value)}
                            className="text-[24px] font-semibold w-full px-4 py-2 mb-4 border border-[#D7D7D7] rounded-lg focus:outline-none"
                            style={epilogue.style}
                            required
                        />
                        <textarea
                            value={newAnswer}
                            placeholder="Answer"
                            onChange={(e) => setNewAnswer(e.currentTarget.value)}
                            className="text-[18px] w-full px-4 py-2 mb-4 border border-[#D7D7D7] rounded-lg focus:outline-none"
                            rows={3}
                            style={epilogue.style}
                            required
                        />
                        <div className="flex flex-row items-end justify-end ml-auto mt-4">
                            <UnstyledButton onClick={handleAddQuestion}>
                                <div className="flex flex-col items-center justify-center mr-4 px-6 py-2 bg-[#38BDBA] rounded-md">
                                    <p className="text-[18px] font-semibold text-white" style={epilogue.style}>
                                        Add Question
                                    </p>
                                </div>
                            </UnstyledButton>
                            <UnstyledButton onClick={closeNewQuestionModal}>
                                <div className="flex flex-col items-center justify-center px-6 py-2 border border-[#38BDBA] rounded-md">
                                    <p className="text-[18px] text-[#38BDBA]" style={epilogue.style}>
                                        Cancel
                                    </p>
                                </div>
                            </UnstyledButton>
                        </div>
                    </form>
                </Modal>

                <UnstyledButton onClick={openNewQuestionModal}>
                    <div className="flex flex-row items-center justify-center px-4 py-2 mb-12 border-2 border-[#38BDBA] rounded-lg">
                        {plusIcon}
                        <p style={epilogue.style} className="text-[20px] text-[#38BDBA] font-semibold ml-2 mb-[-5px]">
                            New Question
                        </p>
                    </div>
                </UnstyledButton>
                {faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="flex flex-col items-start justify-center w-full mb-6 py-4 px-8 border border-black rounded-xl">
                        {editMode === faq.id ? (
                            // edit Mode
                            <>
                                <input
                                    type="text"
                                    value={editedFaq?.question || ""}
                                    onChange={(e) => handleInputChange("question", e.target.value)}
                                    className="text-[24px] font-semibold w-full px-4 py-2 mb-4 border border-[#D7D7D7] rounded-lg focus:outline-none"
                                    style={epilogue.style}
                                />
                                <textarea
                                    value={editedFaq?.answer || ""}
                                    onChange={(e) => handleInputChange("answer", e.target.value)}
                                    className="text-[18px] w-full px-4 py-2 mb-4 border border-[#D7D7D7] rounded-lg focus:outline-none"
                                    rows={3}
                                    style={epilogue.style}
                                />
                                <div className="flex flex-row mt-4">
                                    <UnstyledButton onClick={handleSaveEdit}>
                                        <div className="items-center justify-center mr-6 px-6 py-2 bg-[#38BDBA] rounded-md">
                                            <p className="text-[18px] font-semibold text-white" style={epilogue.style}>
                                                Save
                                            </p>
                                        </div>
                                    </UnstyledButton>
                                    <UnstyledButton onClick={handleCancelEdit}>
                                        <div className="items-center justify-center">
                                            <p className="text-[18px]" style={epilogue.style}>
                                                Cancel
                                            </p>
                                        </div>
                                    </UnstyledButton>
                                </div>
                            </>
                        ) : (
                            // view mode
                            <>
                                <div className="flex flex-row items-start justify-between w-full mb-2">
                                    <p style={epilogue.style} className="text-[24px] font-semibold">
                                        {faq.question}
                                    </p>
                                    <div className="flex flex-row items-start justify-start">
                                        <UnstyledButton className="mr-6" onClick={() => handleEditClick(faq)}>
                                            {editButton}
                                        </UnstyledButton>

                                        <Modal 
                                            opened={openedDeleteFaq} 
                                            onClose={close} 
                                            overlayProps={{
                                                backgroundOpacity: 0.1
                                            }}
                                            centered
                                            withCloseButton={false}
                                        >
                                            <p style={epilogue.style} className="text-[24px]">
                                                Delete FAQ?
                                            </p>
                                            <div className="flex flex-row items-end justify-end mt-4">
                                                <UnstyledButton onClick={() => { deleteFaq(faq.id); closeDeleteFaqModel(); }}>
                                                    <div className="flex flex-col w-[100px] items-center justify-center mr-6 px-6 py-2 bg-[#38BDBA] rounded-md">
                                                        <p className="text-[18px] font-semibold text-white" style={epilogue.style}>
                                                            Delete
                                                        </p>
                                                    </div>
                                                </UnstyledButton>
                                                <UnstyledButton onClick={closeDeleteFaqModel}>
                                                    <div className="flex flex-col w-[100px] items-center justify-center px-6 py-2 border border-[#38BDBA] rounded-md">
                                                        <p className="text-[18px] text-[#38BDBA]" style={epilogue.style}>
                                                            Cancel
                                                        </p>
                                                    </div>
                                                </UnstyledButton>
                                            </div>
                                        </Modal>
                                        <UnstyledButton onClick={openDeleteFaqModel}>
                                            {deleteButton}
                                        </UnstyledButton>
                                    </div>
                                </div>
                                <p style={epilogue.style} className="text-[18px]">
                                    {faq.answer}
                                </p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
