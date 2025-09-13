<template>
    <div>
        <h1>Validator Demo</h1>
        <form @submit.prevent="submit">
            <div>
                <label>Username:</label>
                <input v-model="username" type="text" :id="usernameId" />
                <div v-if="usernameFailed">{{ usernameError }}</div>
            </div>
            <div>
                <label>Email:</label>
                <input v-model="email" type="text" :id="emailId" />
                <div v-if="emailFailed">{{ emailError }}</div>
            </div>
            <div>
                <label>Password:</label>
                <input
                    v-model="password"
                    type="password"
                    :data-id="passwordId"
                />
                <div v-if="passwordFailed">{{ passwordError }}</div>
            </div>
            <button type="submit">Submit</button>
            <button @click.prevent.stop="invalidatePassword">
                Invalidate Password
            </button>
            <button @click.prevent.stop="serverErrors">Server Errors</button>
            <button @click.prevent.stop="() => reset()">Reset</button>

            <hr />
            <pre>{{
                JSON.stringify({
                    isValid: isValid,
                    isFailed: isFailed,
                    isSubmitting: isSubmitting,
                    isSubmitted: isSubmitted,
                })
            }}</pre>

            <div>
                <pre>
                    {{ JSON.stringify(values) }}
                </pre>
            </div>
            <div>
                <pre>
                    {{ JSON.stringify(transformed) }}
                </pre>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { useForm, useField } from "../src";

const {
    ctx,
    values,
    transformed,
    isValid,
    isFailed,
    isSubmitting,
    isSubmitted,

    reset,
    submit,
    onPass,
    onFail,
    invalidate,
    parseErrorResponse,
    scrollToFirstError,
} = useForm("demo", {
    messages: {
        "*": {
            username: {
                min: "3 Character at least",
                exists: "Username already taken",
                "*": "Enter username",
            },
            email: {
                email: "Enter a valid email",
                "*": "Enter email",
            },
            password: {
                min: "6 Character at least",
                required: "Enter Password",
            },
        },
    },
});

const {
    id: emailId,
    value: email,
    error: emailError,
    isFailed: emailFailed,
} = useField(ctx, "email", yup.string().required().email(), {
    trigger: "change",
    initialValue: "",
    transformer: (v) => v.toUpperCase(),
});

const {
    id: usernameId,
    value: username,
    error: usernameError,
    isFailed: usernameFailed,
} = useField(ctx, "username", yup.string().required().min(3), {
    trigger: "change",
    initialValue: "",
});

const {
    id: passwordId,
    value: password,
    error: passwordError,
    isFailed: passwordFailed,
} = useField(ctx, "password", yup.string().required().min(6), {
    initialValue: "",
});

onFail(() => alert("Failed!"));
onPass((v) => alert(JSON.stringify(v)));

function invalidatePassword() {
    invalidate("password", "extra");
    scrollToFirstError();
}

function serverErrors() {
    parseErrorResponse({
        username: ["exists"],
        email: { custom: "Some custom error" },
    });
}
</script>
