const helpers = {
    renderSize(sizeCheck,sizes){
        return sizes.map((size,ind)=>{
          const checked = size === sizeCheck ? "checked" : ""
          return `
          <div>
              <input ${checked} id=${size} class="form-check-input size-pro" name="size" type="radio" value="${size}">
              <label class="size-link"  class="form-check-label" for="${size}">
                  ${size}
              </label>
          </div>
          `
        }).join('')
    },
    renderColor(colorCheck,colors){
        return colors.map((color,ind)=>{
          const checked = color === colorCheck ? "checked" : ""
          return `
          <div>
              <input ${checked} id=${color} class="form-check-input color-pro" name="color" type="radio" value="${color}">
              <label class="color-link"  class="form-check-label" for="${color}">
                  ${color}
              </label>
          </div>
          `
        }).join('')
    },
    renderQty(qty){
        if(qty <= 0){
          return `
            <option value="1">1</option>
          `
        }else{
          const htmlOption = []
          for(let i = 1; i <= qty;++i){
            htmlOption.push(`<option value="${i}">${i}</option>`)
          }
          return htmlOption.join('')
        }
    },
    renderBtnAddPro(qty){
        let stringAdd = 'Add to cart'
        if(Number(qty) <= 0){
          stringAdd = 'Out of stock'
        }
        return `
          <button type="button" class="btn btn-primary btn-lg add-cart" data-toggle="modal" data-target="#myModal2">${stringAdd}</button>
        `
    },
    totalOnePro(price,qtyCurrent){
        return price * qtyCurrent
    },
    totalAllPro(productsChecked){
        return productsChecked.reduce((total,product)=>{
            total += (product.pricePro.price * product.qtyCurrent)
            return total
        },0)
    },
    renderSuccessPrice(price,ship){
      return price + ship
    },
    renderStt(index){
      return index + 1;
    },
    renderPriceOfAllOder(price){
      return price ? price : 0
    },
    renderAdmin(roles){
      if(roles.includes(2003)){
        return `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Admin
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="/client/formCreatePro">Create Product</a>
              <a class="dropdown-item" href="/client/orderUser">Order Of User</a>
              <a class="dropdown-item" href="/client/managePrice">Manage Price</a>
              <a class="dropdown-item" href="/client/watchUser">Manage User</a>
          </div>
        </li>
        `
      }else{
        return ``
      }
    },
    renderInfoUser(roles){
      if(!roles.length){
        return ``
      }else{
        return `
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="sign-out" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </a>
            <div class="dropdown-menu" aria-labelledby="sign-out">
                <a class="dropdown-item" id="btn-sign-out" href="#">Sign Out</a>
            </div>
          </li>
        `
      }
    },
    renderAuthenForm(roles){
      if(!roles.length){
        return `
        <li class="nav-item active">
          <a class="nav-link" href="/authen/register">Register <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active">
          <a class="nav-link" href="/authen/signIn">Sign In <span class="sr-only">(current)</span></a>
        </li>
        `
      }else{
        return ``
      }
    }
}

module.exports = helpers
