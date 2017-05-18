# RxJS

## What is Reactive Programming?

*Reactive programming is programming with asynchronous data streams.*

You might have heard of RxJS, ReactiveX or reactive programming, or even just functional programming.
These are terms that are becoming more and more prominent when talking about the latest-and-greatest frond and back end techonologies.

According to [reactivex.io](reactivex.io):

> ReactiveX is a library for composing asynchronous and event-based programs by using observable sequences.

That's a lot to digest in a single sentence.

In the first step of this introduction, we're going to take a different approach to learning about
RxJS (the JavaScript implementation of ReactiveX) and Observables, by creating `reactive animations` with a help of D3 library.

## Understanding Observables

An array is a collection of elements, such as `[1, 2, 3, 4, 5]`. You get all the elements immediately, and you can do things like
[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map?v=example), [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?v=example), [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=example), [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat?v=example) and so on.
This allows you to transform the collection of elements any way you'd like.

Now suppose that each element sin the array occured *over time*; that is, you don'get all element immediately, but rather one at a time.
You might get first element over 1 second, the next over 3 seconds, and so on.
Here's how that might be represented:


