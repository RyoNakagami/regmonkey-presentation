function Div(el)
    -- make sure js-chart-inject is in the class list
    if not el.classes:includes("js-chart-inject") then
        return nil
    end

    local jsfile = el.attributes["data-js"]
    local container = el.attributes["data-container"]
    local width = el.attributes["data-width"] or "unset"
    local height = el.attributes["data-height"] or "unset"

    if jsfile and container then
        local div_html = string.format('<div id="%s" style="width: %s; height: %s;"></div>', container, width, height)
        local script_html = string.format('<script src="%s"></script>', jsfile)

        return {pandoc.RawBlock("html", div_html),  pandoc.RawBlock("html", script_html)}
    end
end
