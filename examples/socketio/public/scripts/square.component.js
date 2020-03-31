
angular
    .module('squareGame')
    .component('square', {
        bindings: {
            index: "<",
            currentSquare: "<"
        },

        controller: function($element) {
            /**
             *
             * @type {[*]}
             */
            const ANIMATIONS = [
                'bounce',
                'flash',
                'pulse',
                'rubberBand',
                'shake',
                'swing',
                'tada',
                'wobble',
                'jello'
            ];

            this.lastClass = '';
            /**
             *
             * @param min
             * @param max
             */
            this.random = (min, max) =>  Math.floor(Math.random() * (max - min + 1)) + min;

            this.$onChanges = () => {

                $element.css('background-color', 'transparent');

                if (this.currentSquare && this.index === this.currentSquare.index){
                    $element.removeClass(this.lastClass);

                    const rand = this.random(0, ANIMATIONS.length-1);

                    setTimeout(() => {
                        this.lastClass = ANIMATIONS[rand];
                        $element.addClass(ANIMATIONS[rand]);
                        $element.css('background-color', this.currentSquare.bgc);
                    });

                }
            }
        }
    });
