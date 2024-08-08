import { signUp } from '@/actions';
import { useAuthContext } from '@/context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

type FormFields = {
    email: string;
    password: string;
    first_name: string,
    last_name: string
  };

const Register = ({ setLoginIsDisplayed }: { setLoginIsDisplayed: (val: boolean) => void }) => {
    const [errMessage, setErrMessage] = useState("");
    const {user, setUser} = useAuthContext()
    const [loading, setLoading] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormFields>();
    const watchForEmail = watch("email", "");
    const watchForPassword = watch("password", "");
    const watchForFirstname = watch("first_name", "");
    const watchForLastname = watch("last_name", "");
    const router = useRouter()

    useEffect(() => {
        const IsFormValid =
            watchForEmail.length > 5 &&
            watchForEmail.toLowerCase().includes('@') &&
            watchForEmail.toLowerCase().includes('.com') &&
            watchForPassword.length >= 8 &&
            watchForFirstname.length >= 2 &&
            watchForLastname.length >= 2 

        IsFormValid ? setFormIsValid(true) : setFormIsValid(false)

    }, [watchForEmail, watchForPassword,watchForFirstname, watchForLastname]);

    async function onSubmit(data: FormFields) {
        setLoading(true)
        const response = await signUp(data)
        if (response.status_code === 201) {
          setErrMessage("registration successfully")
          const context = {
            id: response.data.user.id,
            email: response.data.user.email,
            access_token: response.access_token,
          }
          setUser(context)
          router.push('/chat-rooms')
          setLoading(false)
          return
        }
        setErrMessage(response.message)
    }

    return (
        <div className="w-full md:w-[60%] text-dark-light lg:w-[50%] flex flex-col">
            <form
                className="flex w-full flex-col gap-8 shadow-custom-inset px-4 md:px-8 py-10 rounded-lg bg-white md:w-[674px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-[24px] text-heading-m text-black font-bold">SignUp</h3>
                    <p>Create a new account, let begin the fun!</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="cuurent-password">Email address</label>
                        <div className="flex items-center gap-2 relative w-full rounded-md border">
                            <span className="text-18px absolute left-4 top-[38%] z-10">
                                <Mail size={'18px'} />
                            </span>
                            <input
                                className={`outline-none flex-1 relative border-gray pl-12 px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${errors.password && 'border-red focus:ring-0 border'}`}
                                {...register("email", {
                                    required: 'cant be empty',
                                })}
                                placeholder="eg.alex@email.com"
                                type="email"
                            />
                            {errors.email && <p className="text-red text-[12px] absolute right-2 top-[32%]">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="cuurent-password">Firstname</label>
                        <div className="flex items-center gap-2 relative w-full rounded-md border">
                            <span className="text-18px absolute left-4 top-[38%] z-10">
                                <Mail size={'18px'} />
                            </span>
                            <input
                                className={`outline-none flex-1 relative border-gray pl-12 px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${errors.password && 'border-red focus:ring-0 border'}`}
                                {...register("first_name", {
                                    required: 'cant be empty',
                                })}
                                placeholder="John"
                                type="text"
                            />
                            {errors.first_name && <p className="text-red text-[12px] absolute right-2 top-[32%]">{errors.first_name.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="cuurent-password">Lastname</label>
                        <div className="flex items-center gap-2 relative w-full rounded-md border">
                            <span className="text-18px absolute left-4 top-[38%] z-10">
                                <Mail size={'18px'} />
                            </span>
                            <input
                                className={`outline-none flex-1 relative border-gray pl-12 px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${errors.password && 'border-red focus:ring-0 border'}`}
                                {...register("last_name", {
                                    required: 'cant be empty',
                                })}
                                placeholder="Doe"
                                type="text"
                            />
                            {errors.last_name && <p className="text-red text-[12px] absolute right-2 top-[32%]">{errors.last_name.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-4">
                        <label htmlFor="new-password">Password</label>
                        <div className="flex items-center gap-2 relative w-full rounded-md border">
                            <span className="text-18px absolute left-4 top-[38%] z-10">
                                <Lock size={'18px'} />
                            </span>
                            <input
                                className={`outline-none flex-1 relative border-gray pl-12 px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${errors.password && 'border-red focus:ring-0 border'}`}
                                type="password"
                                {...register("password", {
                                    required: 'Please check again',
                                    minLength: { value: 8, message: 'Please chech again' }
                                })}
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="text-red text-[12px] absolute right-2 top-[32%]">{errors.password.message}</p>}
                        </div>
                    </div>
                </div>
                {errMessage && <p className="text-red text-[18px] pb-2">{errMessage}</p>}
                <button type="submit" className="bg-primary-yellow border shadow-custom-inset border-secondary p-[11px] rounded-lg text-[18px] text-white">
                    {loading ? 'Loading...' : 'Signup'}
                </button>
                <p
                    className="text-center flex flex-col md:flex-row md:justify-center gap-4 items-center md:gap-[.2em]">
                    Already have an account?
                    <span onClick={() => setLoginIsDisplayed(true)}
                        className="text-black cursor-pointer">
                        Signin
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Register
