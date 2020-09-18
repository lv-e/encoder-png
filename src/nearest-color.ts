
import Color from "color";

export function nearest(r:number,g:number,b:number) : number {
    
    if( r == 0 && g == 0 && b == 0) return 0;

    const db32 = [
        "#000000",
        "#222034",
        "#45283c",
        "#663931",
        "#8f563b",
        "#df7126",
        "#d9a066",
        "#eec39a",
        "#fbf236",
        "#99e550",
        "#6abe30",
        "#37946e",
        "#4b692f",
        "#524b24",
        "#323c39",
        "#3f3f74",
        "#306082",
        "#5b6ee1",
        "#639bff",
        "#5fcde4",
        "#cbdbfc",
        "#ffffff",
        "#9badb7",
        "#847e87",
        "#696a6a",
        "#595652",
        "#76428a",
        "#ac3232",
        "#d95763",
        "#d77bba",
        "#8f974a",
        "#8a6f30"
    ]

    let minDistance = 9999;
    let selectedColor = 0;
    let color = Color({r: r, g: g, b: b})

    for (let i = 1; i < db32.length; i++) {

        const indexed = db32[i];
        const iColor = Color(indexed)

        const distance = Math.sqrt(
              ((color.red() - iColor.red()) ^ 2.0)
            + ((color.green() - iColor.green()) ^ 2.0)
            + ((color.blue() - iColor.blue()) ^ 2.0)
            + ((color.hue() - iColor.hue()) ^ 2.0)
        )

        if (distance < minDistance) {
            minDistance = distance;
            selectedColor = i;
        }
    }

    return selectedColor

}
