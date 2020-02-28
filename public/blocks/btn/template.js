block('btn')({'tag': 'button'});

block('btn').match((node, ctx) => ctx.btnText)({
    content: (node, ctx) => [
        {
            mix: ctx.color === 'blue' ? {'block': 'btn__text_b'} : {'block': 'btn__text_w'},
            elem: 'text',
            content: ctx.btnText,
        },
    ],
});
